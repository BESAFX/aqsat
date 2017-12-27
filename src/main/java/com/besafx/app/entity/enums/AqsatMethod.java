package com.besafx.app.entity.enums;

public enum AqsatMethod {
    Monthly("شهري"),
    Half("نصف سنوي"),
    Annual("سنوي");
    private String name;

    AqsatMethod(String name) {
        this.name = name;
    }

    public static AqsatMethod findByName(String name) {
        for (AqsatMethod v : values()) {
            if (v.getName().equals(name)) {
                return v;
            }
        }
        return null;
    }

    public static AqsatMethod findByValue(String value) {
        for (AqsatMethod v : values()) {
            if (v.name().equals(value)) {
                return v;
            }
        }
        return null;
    }

    public String getName() {
        return name;
    }
}
