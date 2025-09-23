package com.docappts.PracticeMS.enums;

public enum Specialty {
    GENERAL_PRACTITIONER("General Practitioner"),
    GASTROENTEROLOGIST("Gastroenterologist"),
    NEUROLOGIST("Neurologist"),
    ENDOCRINOLOGIST("Endocrinologist"),
    IRON_INFUSIONS("Iron Infusions"),
    HEMATOLOGIST("Hematologist");

    private String displayName;

    Specialty(String displayName) {
        this.displayName = displayName;
    }

    public String displayName() {
        return displayName;
    }

    @Override
    public String toString() {
        return displayName;
    }
}
