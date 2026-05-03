package com.example.cse416_backend;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CompareDataRepository extends MongoRepository<CompareDataDocument, String> {
    Optional<CompareDataDocument> findByCurrentState(String currentState);
}
