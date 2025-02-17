package br.com.arrowdata.generic.exception;

public class GenericErrorResponse {

	private String mensagem;

	public GenericErrorResponse(String mensagem) {
		super();
		this.mensagem = mensagem;
	}

	public String getMensagem() {
		return mensagem;
	}

	public void setMensagem(String mensagem) {
		this.mensagem = mensagem;
	}



}