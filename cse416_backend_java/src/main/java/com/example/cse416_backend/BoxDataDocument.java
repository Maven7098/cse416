package com.example.cse416_backend;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "box_data")
public class BoxDataDocument {

    @Id
    private String id;

    @Field("currentState")
    private String currentState;

    @Field("mode")
    private String mode; // "Current", "NonVRA", "VRA"

    @Field("payload")
    private org.bson.Document payload;

    public BoxDataDocument() {}

    public BoxDataDocument(String currentState, String mode, org.bson.Document payload) {
        this.currentState = currentState;
        this.mode = mode;
        this.payload = payload;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCurrentState() {
        return currentState;
    }

    public void setCurrentState(String currentState) {
        this.currentState = currentState;
    }

    public String getMode() {
        return mode;
    }

    public void setMode(String mode) {
        this.mode = mode;
    }

    public org.bson.Document getPayload() {
        return payload;
    }

    public void setPayload(org.bson.Document payload) {
        this.payload = payload;
    }
}
