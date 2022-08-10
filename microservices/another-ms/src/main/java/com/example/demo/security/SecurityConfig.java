package com.example.demo.security;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtDecoders;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Value("${spring.security.oauth2.client.provider.oidc.issuer-uri}")
    private String issuerUri;

    @Value("${spring.security.oauth2.client.registration.oidc.client-id}")
    private String clientId;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors()
                .and()
                .authorizeHttpRequests(authorize -> authorize
                        .mvcMatchers("/api/**").authenticated()
                        .anyRequest().permitAll()
                )
                .oauth2ResourceServer().jwt()
                .jwtAuthenticationConverter(jwtAuthenticationConverter())
                .decoder(jwtDecoder());
        return http.build();
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        NimbusJwtDecoder jwtDecoder = JwtDecoders.fromOidcIssuerLocation(issuerUri);
        OAuth2TokenValidator<Jwt> withIssuer = JwtValidators.createDefaultWithIssuer(issuerUri);
        jwtDecoder.setJwtValidator(new DelegatingOAuth2TokenValidator<>(withIssuer));
        return jwtDecoder;
    }

    private JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtAuthenticationConverter jwtConverter = new JwtAuthenticationConverter();
        jwtConverter.setJwtGrantedAuthoritiesConverter(new KeycloakResourceRoleConverter());
        return jwtConverter;
    }

    private class KeycloakResourceRoleConverter implements Converter<Jwt, Collection<GrantedAuthority>> {

        @Override
        public Collection<GrantedAuthority> convert(Jwt jwt) {
            Map<String, Object> resourceAccess = (Map<String, Object>) jwt.getClaims().get("resource_access");
            Map<String, Object> clientAccess = (Map<String, Object>) resourceAccess.get(clientId);
            if (clientAccess == null) {
                return Collections.emptyList();
            } else {
                return ((List<String>) clientAccess.get("roles")).stream()
                        .map(SimpleGrantedAuthority::new)
                        .collect(Collectors.toList());
            }
        }
    }
}
