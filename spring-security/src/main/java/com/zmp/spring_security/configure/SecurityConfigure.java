package com.zmp.spring_security.configure;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@RequiredArgsConstructor
@EnableWebSecurity
@Configuration
public class SecurityConfigure {

    private final JwtAuthFilter jwtAuthFilter; // Inject your JwtAuthFilter
    private final AuthenticationProvider authenticationProvider;
    private final JwtService jwtService;
    private final OAuthSuccessHandler oAuthSuccessHandler;



        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
            return httpSecurity
                    .csrf(csrf -> csrf.disable())
                    .cors(cors -> cors.configure(httpSecurity))

                    .authorizeHttpRequests(auth -> auth

                            .requestMatchers("/api/v1/auth/**").permitAll()
                            .anyRequest().authenticated()
                    )
//                    .formLogin(form -> form.disable())
                    .sessionManagement(session -> session
                            .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                    )
                    .oauth2Login(oauth -> oauth
                            .successHandler(oAuthSuccessHandler)
                    )

                    .authenticationProvider(authenticationProvider)
                    .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                    .build();


        }
}
