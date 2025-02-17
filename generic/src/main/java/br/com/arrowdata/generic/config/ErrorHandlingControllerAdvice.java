package br.com.arrowdata.generic.config;

import javax.persistence.NoResultException;
import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;

import org.springframework.http.HttpStatus;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import br.com.arrowdata.generic.exception.BadRequestException;
import br.com.arrowdata.generic.exception.ErroInternoException;
import br.com.arrowdata.generic.exception.GenericErrorResponse;
import br.com.arrowdata.generic.exception.ValidationErrorResponse;
import br.com.arrowdata.generic.exception.Violation;


@ControllerAdvice
public class ErrorHandlingControllerAdvice {

	@ExceptionHandler(NoResultException.class)
	@ResponseStatus(HttpStatus.NOT_FOUND)
	@ResponseBody
	GenericErrorResponse onNoResultException(NoResultException e) {
		return new GenericErrorResponse("Recurso não encontrado.");
	}

	@ExceptionHandler(ErroInternoException.class)
	@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
	@ResponseBody
	GenericErrorResponse onErroInternoException(ErroInternoException e) {
		return new GenericErrorResponse(e.getMensagem());
	}

	@ExceptionHandler(BadRequestException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ResponseBody
	ValidationErrorResponse onBadRequestException(BadRequestException e) {
		ValidationErrorResponse error = new ValidationErrorResponse();
		error.getViolations().add(new Violation(e.getCampo(), e.getMensagem()));
		return error;
	}

	@ExceptionHandler(MethodArgumentTypeMismatchException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ResponseBody
	ValidationErrorResponse onMethodArgumentTypeMismatchException(MethodArgumentTypeMismatchException e) {
		ValidationErrorResponse error = new ValidationErrorResponse();
		error.getViolations().add(new Violation(e.getParameter().getParameterName(), "Valor inválido"));
		return error;
	}

	@ExceptionHandler(MissingServletRequestParameterException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ResponseBody
	ValidationErrorResponse onMissingServletRequestParameterException(MissingServletRequestParameterException e) {
		ValidationErrorResponse error = new ValidationErrorResponse();
		error.getViolations().add(new Violation(e.getParameterName(), "Não informado"));
		return error;
	}

	@ExceptionHandler(BindException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ResponseBody
	ValidationErrorResponse onBindException(BindException e) {
		ValidationErrorResponse error = new ValidationErrorResponse();
		for (FieldError violation : e.getBindingResult().getFieldErrors()) {
			error.getViolations().add(new Violation(violation.getField().toString(), violation.getDefaultMessage()));
		}
		return error;
	}

	@SuppressWarnings("rawtypes")
	@ExceptionHandler(ConstraintViolationException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ResponseBody
	ValidationErrorResponse ConstraintViolationException(ConstraintViolationException e) {
		ValidationErrorResponse error = new ValidationErrorResponse();
		for (ConstraintViolation violation : e.getConstraintViolations()) {
			String[] fieldPath = violation.getPropertyPath().toString().split("\\.");
			error.getViolations().add(new Violation(fieldPath[fieldPath.length-1], violation.getMessage()));
		}
		return error;
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ResponseBody
	ValidationErrorResponse onMethodArgumentNotValidException(MethodArgumentNotValidException e) {
		ValidationErrorResponse error = new ValidationErrorResponse();
		for (FieldError fieldError : e.getBindingResult().getFieldErrors()) {
			error.getViolations().add(new Violation(fieldError.getField(), fieldError.getDefaultMessage()));
		}
		return error;
	}
}