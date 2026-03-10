package com.docappts.AppointmentMS.enums;

public enum Specialty {
    GENERAL_PRACTITIONER("General Practitioner"),
    GASTROENTEROLOGIST("Gastroenterologist"),
    NEUROLOGIST("Neurologist");

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
