package com.example.cse416_backend;

import java.util.Optional;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BoxDataRepository extends MongoRepository<BoxDataDocument, String> {
    Optional<BoxDataDocument> findByCurrentStateAndMode(String currentState, String mode);
    List<BoxDataDocument> findByCurrentState(String currentState);
}
