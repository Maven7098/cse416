package com.example.cse416_backend;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "home_geojson")
public class HomeGeoJsonDocument {

    @Id
    private String id;

    @Field("stateCode")
    private String stateCode;

    @Field("payload")
    private org.bson.Document payload;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getStateCode() {
        return stateCode;
    }

    public void setStateCode(String stateCode) {
        this.stateCode = stateCode;
    }

    public org.bson.Document getPayload() {
        return payload;
    }

    public void setPayload(org.bson.Document payload) {
        this.payload = payload;
    }
}
