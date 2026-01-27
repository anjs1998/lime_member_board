package com.example.project.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;


@Configuration

public class SecurityConfig {

	@Bean
	public BCryptPasswordEncoder bCryptPasswordEncoder() {
		return new BCryptPasswordEncoder();
	}
	/** 이 함수를 전혀 이해못했음.
	 * 
	 * 
	 */
	/*@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
	    return http
	        .csrf(csrf -> csrf.disable())
	        .authorizeHttpRequests(auth -> auth
	            .requestMatchers("/member/**", "/css/**").permitAll()
	            .anyRequest().authenticated()
	        )
	        .build();
	}*/
}
