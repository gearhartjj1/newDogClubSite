-- Create MemberDogs table to store member's dogs
CREATE TABLE IF NOT EXISTS MemberDogs (
  DogID INT AUTO_INCREMENT PRIMARY KEY,
  FamilyID INT NOT NULL,
  DogName VARCHAR(255) NOT NULL,
  DogAge VARCHAR(50),
  DogBreed VARCHAR(100),
  CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Foreign key constraint linking to Teacher table's Family column
  CONSTRAINT FK_MemberDogs_Family 
    FOREIGN KEY (FamilyID) REFERENCES Teacher(Family) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE,
  
  -- Index for faster queries by FamilyID
  INDEX idx_FamilyID (FamilyID),
  INDEX idx_DogName (DogName)
);