package encrypt

import (
	"bytes"
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"encoding/base64"
	"encoding/hex"
	"errors"
	"log"
)

// Generate a random 32-byte secret key
func GenerateSecretKey() (string, error) {
	keyBytes := make([]byte, 32)
	if _, err := rand.Read(keyBytes); err != nil {
		return "", err
	}
	return hex.EncodeToString(keyBytes), nil
}

// Generate a token for the user to authenticate with
// Encrypts a user ID with a secret key using AES encryption
func EncryptUserID(userID string, secretKey string) (string, error) {
	// Convert the secret key string to a byte slice
	key := []byte(secretKey)

	// Create a new AES cipher block using the secret key
	block, err := aes.NewCipher(key)
	if err != nil {
		return "", err
	}

	// Pad the user ID to a multiple of the block size
	paddedUserID := padPKCS7([]byte(userID), block.BlockSize())

	// Generate a new initialization vector
	iv := make([]byte, aes.BlockSize)
	if _, err := rand.Read(iv); err != nil {
		return "", err
	}

	// Encrypt the padded user ID using AES-CBC encryption
	encrypted := make([]byte, len(paddedUserID))
	mode := cipher.NewCBCEncrypter(block, iv)
	mode.CryptBlocks(encrypted, paddedUserID)

	// Combine the initialization vector and encrypted data into a single string
	combined := append(iv, encrypted...)

	log.Println(base64.StdEncoding.EncodeToString(combined))
	// Encode the combined string as a base64-encoded string
	return base64.StdEncoding.EncodeToString(combined), nil
}

// Pads the input byte slice to a multiple of the block size using PKCS#7 padding
func padPKCS7(input []byte, blockSize int) []byte {
	padding := blockSize - (len(input) % blockSize)
	padText := bytes.Repeat([]byte{byte(padding)}, padding)
	return append(input, padText...)
}

// Unpads the input byte slice using PKCS#7 padding
func unpadPKCS7(input []byte) ([]byte, error) {
	length := len(input)
	unpadding := int(input[length-1])
	if unpadding > length {
		return nil, errors.New("invalid padding")
	}
	return input[:(length - unpadding)], nil
}

// validateToken checks if the token is valid
func ValidateToken(token string, secretKey string) (string, error) {
	// Convert the secret key string to a byte slice
	key := []byte(secretKey)

	// Decode the base64-encoded token string
	decoded, err := base64.StdEncoding.DecodeString(token)
	if err != nil {
		return "", err
	}

	// Extract the initialization vector and encrypted data from the decoded string
	iv := decoded[:aes.BlockSize]
	encrypted := decoded[aes.BlockSize:]

	// Create a new AES cipher block using the secret key
	block, err := aes.NewCipher(key)
	if err != nil {
		return "", err
	}

	// Decrypt the encrypted data using AES-CBC encryption
	decrypted := make([]byte, len(encrypted))
	mode := cipher.NewCBCDecrypter(block, iv)
	mode.CryptBlocks(decrypted, encrypted)

	// Remove the PKCS#7 padding from the decrypted data
	decrypted, err = unpadPKCS7(decrypted)
	if err != nil {
		return "", err
	}

	// Convert the decrypted data to a string
	return string(decrypted), nil
}

// func decrypt(ciphertext, key []byte) ([]byte, error) {
// 	block, err := aes.NewCipher(key)
// 	if err != nil {
// 		return nil, err
// 	}
// 	if len(ciphertext) < aes.BlockSize {
// 		return nil, errors.New("ciphertext too short")
// 	}
// 	iv := ciphertext[:aes.BlockSize]
// 	ciphertext = ciphertext[aes.BlockSize:]
// 	stream := cipher.NewCFBDecrypter(block, iv)
// 	stream.XORKeyStream(ciphertext, ciphertext)
// 	return ciphertext, nil
// }
