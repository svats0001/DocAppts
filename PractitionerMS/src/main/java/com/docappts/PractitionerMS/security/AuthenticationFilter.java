package com.docappts.PractitionerMS.security;

import java.io.IOException;
import java.io.PrintWriter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.WebAttributes;
import org.springframework.security.web.savedrequest.DefaultSavedRequest;
import org.springframework.security.web.savedrequest.HttpSessionRequestCache;
import org.springframework.security.web.savedrequest.SavedRequest;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.filter.GenericFilterBean;

import com.docappts.PractitionerMS.service.KeyService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

public class AuthenticationFilter extends GenericFilterBean {

    private String api_token;

    public AuthenticationFilter(String api_token) {
        this.api_token = api_token;
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain filterChain)
      throws IOException, ServletException {
        try {
            if (request.getRemoteHost().equals("localhost") && request.getRemotePort() == 9090) {
                SecurityContextHolder.getContext().setAuthentication(new ApiKeyAuthentication("", AuthorityUtils.NO_AUTHORITIES));
            } else {
                Authentication authentication = AuthenticationService.getAuthentication((HttpServletRequest) request, api_token);
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception exp) {
            HttpServletResponse httpResponse = (HttpServletResponse) response;
            httpResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            httpResponse.setContentType(MediaType.APPLICATION_JSON_VALUE);
            PrintWriter writer = httpResponse.getWriter();
            writer.print(exp.getMessage());
            writer.flush();
            writer.close();
        }

        filterChain.doFilter(request, response);
    }
}