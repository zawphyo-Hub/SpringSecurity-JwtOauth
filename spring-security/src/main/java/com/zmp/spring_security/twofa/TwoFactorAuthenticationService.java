package com.zmp.spring_security.twofa;

import dev.samstevens.totp.code.*;
import dev.samstevens.totp.exceptions.QrGenerationException;
import dev.samstevens.totp.exceptions.TimeProviderException;
import dev.samstevens.totp.qr.QrData;
import dev.samstevens.totp.qr.QrGenerator;
import dev.samstevens.totp.qr.ZxingPngQrGenerator;
import dev.samstevens.totp.secret.DefaultSecretGenerator;
import dev.samstevens.totp.time.SystemTimeProvider;
import dev.samstevens.totp.time.TimeProvider;
import dev.samstevens.totp.util.Utils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j //lombok dependencies to check errors or response Eg:(log.error("error"))
public class TwoFactorAuthenticationService {

    //generate secret key
    public String generateNewSecret(){
        return new DefaultSecretGenerator().generate(); //DefaultSecretGenerator() from totp dependencies
    }

    //generate qr code
    public String generateQrCodeImage(String secret){
        QrData qrData = new QrData.Builder()
                .label("2FA Qr code")
                .secret(secret)
                .issuer("Ryan_Phyo") //give name of the application
                .algorithm(HashingAlgorithm.SHA1)
                .digits(6) // length of TOTP digits
                .period(30) //default 30s fro TOTP code
                .build();

        QrGenerator qrGenerator = new ZxingPngQrGenerator(); // from dependencies
        byte[] imageData = new byte[0];
        try{
            imageData = qrGenerator.generate(qrData);
        } catch (QrGenerationException e) {
            log.error("Error generating qr code");
            throw new RuntimeException(e);
        }
        return Utils.getDataUriForImage(imageData, qrGenerator.getImageMimeType());
    }


    //check totp valid or not valid
    public boolean isTotpValid(String secret, String code){
        TimeProvider timeProvider = new SystemTimeProvider();
        CodeGenerator codeGenerator = new DefaultCodeGenerator();
        CodeVerifier codeVerifier = new DefaultCodeVerifier( codeGenerator, timeProvider);
        return codeVerifier.isValidCode(secret, code);

    }

    public boolean isTotpNotValid(String secret, String code){

        return !this.isTotpValid(secret, code);

    }






}
