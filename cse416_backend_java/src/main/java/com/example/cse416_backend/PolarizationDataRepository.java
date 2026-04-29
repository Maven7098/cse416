package com.example.cse416_backend;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface PolarizationDataRepository extends MongoRepository<PolarizationDataDocument, String> {
    Optional<PolarizationDataDocument> findByCurrentState(String currentState);
}