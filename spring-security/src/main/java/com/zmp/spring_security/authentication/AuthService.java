package com.zmp.spring_security.authentication;

import com.zmp.spring_security.configure.JwtService;
import com.zmp.spring_security.twofa.TwoFactorAuthenticationService;
import com.zmp.spring_security.user.Role;
import com.zmp.spring_security.user.User;
import com.zmp.spring_security.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final TwoFactorAuthenticationService twoFAService;

    public AuthenticationResponse register(RegisterRequest registerRequest) {

        // check duplicate email and username
        if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Email already exist!!");

        }

        var user = User.builder()
                .full_name(registerRequest.getFull_name())
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .role(Role.USER) //registerRequest.getRole()
                .mfaEnabled(registerRequest.isMfaEnabled()) //2FA
                .build();

        //if MFA enabled ---> Generate secret key
        if(registerRequest.isMfaEnabled()){
            user.setSecret(twoFAService.generateNewSecret());
        }

        userRepository.save(user);
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .secretQrCode(twoFAService.generateQrCodeImage(user.getSecret())) //qr code image
                .token(jwtToken)
                .mfaEnabled(user.getMfaEnabled())
                .build();

    }


    public AuthenticationResponse authentication(AuthRequest authRequest) {


        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            authRequest.getEmail(),
                            authRequest.getPassword()
                    )
            );
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email or Password Invalid!!");
        }

        var user = userRepository.findByEmail(authRequest.getEmail()).orElseThrow(
                () -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email or Password Invalid!!")
        );

        if (user.getMfaEnabled()){ //if mfa enable
            return AuthenticationResponse.builder()
                    .token("")
                    .mfaEnabled(true) //frontend will check this to decide what to do next
                    .build();

        }

        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .mfaEnabled(false)
                .build();

    }

    public AuthenticationResponse verifyCode(VerificationRequest verificationRequest) {
        User user = userRepository
                .findByEmail(verificationRequest.getEmail())
                .orElseThrow(() -> new EntityNotFoundException(("No user found")));



        String secret = user.getSecret();
        String code = verificationRequest.getCode();

        log.info("Verifying code: {} for secret: {}", code, secret);

        boolean valid = twoFAService.isTotpValid(secret, code);

        log.info("Code valid? {}", valid);

        if (!valid) {
            throw new BadCredentialsException("OTP Code incorrect!!");
        }

//        if (twoFAService.isTotpNotValid(user.getSecret(), verificationRequest.getCode())){
//            throw new BadCredentialsException("OTP Code incorrect!!");
//        }
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .mfaEnabled(user.getMfaEnabled())
                .build();


    }
}
