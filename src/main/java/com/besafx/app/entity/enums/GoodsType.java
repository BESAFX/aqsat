package com.besafx.app.entity.enums;

public enum GoodsType {
    Shares("أسهم"),
    Half_Shares("نصف سهم"),
    Cars("سيارات");
    private String name;

    GoodsType(String name) {
        this.name = name;
    }

    public static GoodsType findByName(String name) {
        for (GoodsType v : values()) {
            if (v.getName().equals(name)) {
                return v;
            }
        }
        return null;
    }

    public static GoodsType findByValue(String value) {
        for (GoodsType v : values()) {
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
