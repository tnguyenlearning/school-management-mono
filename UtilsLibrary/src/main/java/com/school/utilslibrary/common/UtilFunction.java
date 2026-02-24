package com.school.utilslibrary.common;

public class UtilFunction {
	
	public static boolean isEQ(String s1, String s2) {
		if (s1 != null) {
			return s1.equals(s2);
		}
		return false;
	}
	
	public static boolean isNE(String s1, String s2) {
		if (s1 != null) {
			return !s1.equals(s2);
		}
		return false;
	}

}
 