CREATE TABLE users(
	id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	username VARCHAR(255) NOT NULL,
	domain VARCHAR(255) NOT NULL,
	token VARCHAR(255),
	url_pipedrive VARCHAR(255),
	email varchar(255) NOT NULL,
	hash_password VARCHAR(255) NOT NULL,
	active TINYINT(1) DEFAULT 1
);

CREATE TABLE publish_pipedrive(
	id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	fk_user_id BIGINT NOT NULL,
	callid varchar(50) NOT null,
	calllogkey varchar(50) NOT null,
	incall TINYINT(1) DEFAULT 1,
	ready TINYINT(1) DEFAULT 0,
	uploaded TINYINT(1) DEFAULT 0,
	pipedrive_calllog_id VARCHAR(255) NOT NULL,
	create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (fk_user_id) REFERENCES users (id)
);

123
