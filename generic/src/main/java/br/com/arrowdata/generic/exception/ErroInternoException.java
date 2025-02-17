package br.com.arrowdata.generic.exception;

public class ErroInternoException extends Exception{

	private static final long serialVersionUID = -4810362088298071392L;

	private final String mensagem;

	public ErroInternoException(String mensagem) {
		super();
		this.mensagem = mensagem;
	}

	public String getMensagem() {
		return mensagem;
	}

}
