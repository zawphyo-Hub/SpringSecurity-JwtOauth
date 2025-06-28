package com.zmp.spring_security.configure;

import com.zmp.spring_security.configure.JwtService;
import com.zmp.spring_security.user.Role;
import com.zmp.spring_security.user.User;
import com.zmp.spring_security.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuthSuccessHandler implements AuthenticationSuccessHandler {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication)
            throws IOException, ServletException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name"); // full name from Google

        if (email == null) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Email not found from OAuth2 provider");
            return;
        }

        // Step 1: Load or Create
        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);

            // Google returns "name" as full name
            newUser.setFull_name(name != null ? name : "OAuth User");

            // Set empty or default password if required by schema
            newUser.setPassword(""); // or "oauth_login"
            newUser.setRole(Role.USER);
            return userRepository.save(newUser);
        });


        // Step 2: Generate JWT
        String jwtToken = jwtService.generateToken(user);

        // Step 3: Redirect to frontend with token
        response.sendRedirect("http://localhost:5173/oauthsuccess?token=" + jwtToken);

    }
}

