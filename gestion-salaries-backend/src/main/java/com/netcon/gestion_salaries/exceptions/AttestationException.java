package com.netcon.gestion_salaries.exceptions;

public class AttestationException extends RuntimeException {
    public AttestationException() {
        super();
    }


    public AttestationException(String message) {
        super(message);
    }


    public AttestationException(String message, Throwable cause) {
        super(message, cause);
    }


    public AttestationException(Throwable cause) {
        super(cause);
    }

}
