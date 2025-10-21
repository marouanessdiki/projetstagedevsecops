package com.netcon.gestion_salaries.exceptions;

public class EmployeException extends RuntimeException  {

    public EmployeException() {
        super();
    }


    public EmployeException(String message) {
        super(message);
    }


    public EmployeException(String message, Throwable cause) {
        super(message, cause);
    }


    public EmployeException(Throwable cause) {
        super(cause);
    }

}
