package main

import (
	"bytes"
	"context"
	"fmt"
	"log"
	"os"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/aws/aws-sdk-go-v2/service/s3/types"
)

type Storage struct {
	svc *s3.Client
}

func (s *Storage) Connect() {

	accessKeyID := ""
	secretAccessKey := ""
	region := ""
	endpoint := ""

	cfg, err := config.LoadDefaultConfig(context.TODO(),
		config.WithRegion(region),
		config.WithCredentialsProvider(credentials.NewStaticCredentialsProvider(accessKeyID, secretAccessKey, "")),
	)

	if err != nil {
		log.Printf("Failed to create config: %v", err)
		return
	}

	svc := s3.NewFromConfig(cfg, func(o *s3.Options) {
		o.BaseEndpoint = aws.String(endpoint)
	})

	filePath := "data.csv"
	bucketName := "images-prefabs"
	key := "test/data2.csv"

	err = uploadFileToS3(svc, filePath, bucketName, key)
	if err != nil {
		log.Printf("Failed to upload file: %v", err)
		return
	}

	// url, err := getPresignedURL(svc, bucketName, key)
	// if err != nil {
	//     log.Fatalf("Failed to get presigned URL: %v", err)
	// }

	err = makeFilePublic(svc, bucketName, key)
	url := fmt.Sprintf("%s/%s/%s", endpoint, bucketName, key)

	if err != nil {
		log.Printf("Failed to make file public: %v", err)
		return
	}

	fmt.Printf("File uploaded successfully. URL: %s\n", url)

	s.svc = svc
}

func uploadFileToS3(svc *s3.Client, filePath, bucket, key string) error {
	file, err := os.Open(filePath)
	if err != nil {
		return fmt.Errorf("failed to open file %q, %v", filePath, err)
	}
	defer file.Close()

	fileInfo, _ := file.Stat()
	size := fileInfo.Size()
	buffer := make([]byte, size)
	file.Read(buffer)

	_, err = svc.PutObject(context.TODO(), &s3.PutObjectInput{
		Bucket:        aws.String(bucket),
		Key:           aws.String(key),
		Body:          bytes.NewReader(buffer),
		ContentLength: &size,
		ContentType:   aws.String("image/jpeg"), // Adjust based on your file type,
	})

	return err
}

// func getPresignedURL(svc *s3.Client, bucket, key string) (string, error) {
//     presignClient := s3.NewPresignClient(svc)
//     req, err := presignClient.PresignGetObject(context.TODO(), &s3.GetObjectInput{
//         Bucket: aws.String(bucket),
//         Key:    aws.String(key),
//     }, s3.WithPresignExpires(15*time.Minute))

//     if err != nil {
//         return "", fmt.Errorf("failed to sign request: %v", err)
//     }

//     return req.URL, nil
// }

func makeFilePublic(svc *s3.Client, bucket, key string) error {
	_, err := svc.PutObjectAcl(context.TODO(), &s3.PutObjectAclInput{
		Bucket: aws.String(bucket),
		Key:    aws.String(key),
		ACL:    types.ObjectCannedACLPublicRead,
	})

	return err
}
