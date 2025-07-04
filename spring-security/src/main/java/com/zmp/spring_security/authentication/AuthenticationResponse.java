package com.zmp.spring_security.authentication;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_EMPTY) //to remove the field that are empty
// (secretQrCode will be empty if user didn't enable 2FA)
public class AuthenticationResponse {
    private String token;
    private Boolean mfaEnabled;
    private String secretQrCode;
}
