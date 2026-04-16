package com.example.cse416_backend;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "state_info")
public class StateInfoDocument {

    @Id
    private String id;

    @Field("currentState")
    private String currentState;

    @Field("payload")
    private org.bson.Document payload;

    public StateInfoDocument() {}

    public StateInfoDocument(String currentState, org.bson.Document payload) {
        this.currentState = currentState;
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

    public org.bson.Document getPayload() {
        return payload;
    }

    public void setPayload(org.bson.Document payload) {
        this.payload = payload;
    }
}
