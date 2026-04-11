package com.example.cse416_backend;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "home_geojson")
public class HomeGeoJsonDocument {

    @Id
    private String id;

    @Field("currentState")
    private String currentState;

    @Field("payload")
    private org.bson.Document payload;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getcurrentState() {
        return currentState;
    }

    public void setcurrentState(String currentState) {
        this.currentState = currentState;
    }

    public org.bson.Document getPayload() {
        return payload;
    }

    public void setPayload(org.bson.Document payload) {
        this.payload = payload;
    }
}
