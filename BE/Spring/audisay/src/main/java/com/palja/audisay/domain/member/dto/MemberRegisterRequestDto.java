package com.palja.audisay.domain.member.dto;

import com.palja.audisay.domain.member.annotation.ValidEmail;
import com.palja.audisay.domain.member.annotation.ValidName;
import com.palja.audisay.domain.member.annotation.ValidNickname;
import com.palja.audisay.domain.member.annotation.ValidPassword;
import com.palja.audisay.domain.member.entity.Gender;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@ToString
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MemberRegisterRequestDto {

    @NotNull
    @ValidEmail
    private String email;

    @NotNull
    @ValidPassword
    private String password;

    @NotNull
    @ValidName
    private String name;

    @NotNull
    @ValidNickname
    private String nickname;

    @NotNull
    private LocalDate birth;

    @NotNull
    private Gender gender;

    @NotNull
    private boolean blindFlag;
}
