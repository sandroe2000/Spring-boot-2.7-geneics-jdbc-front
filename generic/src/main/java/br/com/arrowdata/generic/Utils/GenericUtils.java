package br.com.arrowdata.generic.Utils;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;
import java.text.ParseException;

public abstract class GenericUtils {

    public static String getStringFromObject(Object obj) {
		
		if(obj != null) {
			if(obj instanceof Timestamp) {
				SimpleDateFormat dsf = new SimpleDateFormat("dd/MM/yyyy");
				Date dt = new Date(((Timestamp)obj).getTime());
				return dsf.format(dt);
			}else if(obj instanceof Integer) {
				return ((Integer)obj).toString().trim();
			}else if(obj instanceof Long) {
				return ((Long)obj).toString().trim();
			}else if(obj instanceof BigInteger) {
				return ((BigInteger)obj).toString().trim();
			}else if(obj instanceof BigDecimal) {
				return ((BigDecimal)obj).toString().trim();
			}else if(obj instanceof Character) {
				return ((Character)obj).toString().trim();
			}else if(obj instanceof Boolean) {
				return ((Boolean)obj).toString().trim();
			}else {
				return ((String)obj).toString().trim();
			}
		}else {
			return "";
		}
	}

	public static boolean isConvertibleUUID(String input) {
        try {
            UUID.fromString(input);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

	public static UUID convertibleUUID(String input) {
        try {
            return UUID.fromString(input);
        } catch (Exception e) {
            return null;
        }
    }

	public static boolean isConvertibleToDate(String str) {
		SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
		sdf.setLenient(false); // Impede que datas inválidas sejam aceitas
		try {
			sdf.parse(str);
			return true;
		} catch (ParseException e) {
			return false;
		}
	}

	public static Date convertibleToDate(String str) {
		SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
		sdf.setLenient(false); // Impede que datas inválidas sejam aceitas
		try {
			return sdf.parse(str);
		} catch (ParseException e) {
			return null;
		}
	}

	public static boolean isConvertibleToLong(String str) {
		try {
			Long.parseLong(str);
			return true;
		} catch (NumberFormatException e) {
			return false;
		}
	}

	public static Long convertibleToLong(String str) {
		try {
			return Long.parseLong(str);
		} catch (NumberFormatException e) {
			return null;
		}
	}

	public static boolean isConvertibleToBoolean(String str) {
		return "true".equalsIgnoreCase(str) || "false".equalsIgnoreCase(str);
	}

	public static boolean convertibleToBoolean(String str) {
		return "true".equalsIgnoreCase(str) ? true : false;
	}

	public static boolean isConvertibleToInteger(String str) {
		try {
			Integer.parseInt(str);
			return true;
		} catch (NumberFormatException e) {
			return false;
		}
	}

	public static Integer convertibleToInteger(String str) {
		try {
			return Integer.parseInt(str);
		} catch (NumberFormatException e) {
			return null;
		}
	}

	public static boolean isConvertibleToBigInteger(String str) {
		try {
			new BigInteger(str);
			return true;
		} catch (NumberFormatException e) {
			return false;
		}
	}

	public static BigInteger convertibleToBigInteger(String str) {
		try {
			return new BigInteger(str);
		} catch (NumberFormatException e) {
			return null;
		}
	}
	
	public static boolean isConvertibleToBigDecimal(String str) {
		try {
			new BigDecimal(str);
			return true;
		} catch (NumberFormatException e) {
			return false;
		}
	}

	public static BigDecimal convertibleToBigDecimal(String str) {
		try {
			return new BigDecimal(str);
		} catch (NumberFormatException e) {
			return null;
		}
	}
}
