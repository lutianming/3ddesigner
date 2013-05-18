PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE "auth_permission" (
    "id" integer NOT NULL PRIMARY KEY,
    "name" varchar(50) NOT NULL,
    "content_type_id" integer NOT NULL,
    "codename" varchar(100) NOT NULL,
    UNIQUE ("content_type_id", "codename")
);
INSERT INTO "auth_permission" VALUES(1,'Can add permission',1,'add_permission');
INSERT INTO "auth_permission" VALUES(2,'Can change permission',1,'change_permission');
INSERT INTO "auth_permission" VALUES(3,'Can delete permission',1,'delete_permission');
INSERT INTO "auth_permission" VALUES(4,'Can add group',2,'add_group');
INSERT INTO "auth_permission" VALUES(5,'Can change group',2,'change_group');
INSERT INTO "auth_permission" VALUES(6,'Can delete group',2,'delete_group');
INSERT INTO "auth_permission" VALUES(7,'Can add user',3,'add_user');
INSERT INTO "auth_permission" VALUES(8,'Can change user',3,'change_user');
INSERT INTO "auth_permission" VALUES(9,'Can delete user',3,'delete_user');
INSERT INTO "auth_permission" VALUES(10,'Can add content type',4,'add_contenttype');
INSERT INTO "auth_permission" VALUES(11,'Can change content type',4,'change_contenttype');
INSERT INTO "auth_permission" VALUES(12,'Can delete content type',4,'delete_contenttype');
INSERT INTO "auth_permission" VALUES(13,'Can add session',5,'add_session');
INSERT INTO "auth_permission" VALUES(14,'Can change session',5,'change_session');
INSERT INTO "auth_permission" VALUES(15,'Can delete session',5,'delete_session');
INSERT INTO "auth_permission" VALUES(16,'Can add site',6,'add_site');
INSERT INTO "auth_permission" VALUES(17,'Can change site',6,'change_site');
INSERT INTO "auth_permission" VALUES(18,'Can delete site',6,'delete_site');
INSERT INTO "auth_permission" VALUES(19,'Can add comment',7,'add_comment');
INSERT INTO "auth_permission" VALUES(20,'Can change comment',7,'change_comment');
INSERT INTO "auth_permission" VALUES(21,'Can delete comment',7,'delete_comment');
INSERT INTO "auth_permission" VALUES(22,'Can moderate comments',7,'can_moderate');
INSERT INTO "auth_permission" VALUES(23,'Can add comment flag',8,'add_commentflag');
INSERT INTO "auth_permission" VALUES(24,'Can change comment flag',8,'change_commentflag');
INSERT INTO "auth_permission" VALUES(25,'Can delete comment flag',8,'delete_commentflag');
INSERT INTO "auth_permission" VALUES(26,'Can add log entry',9,'add_logentry');
INSERT INTO "auth_permission" VALUES(27,'Can change log entry',9,'change_logentry');
INSERT INTO "auth_permission" VALUES(28,'Can delete log entry',9,'delete_logentry');
INSERT INTO "auth_permission" VALUES(29,'Can add msg',10,'add_msg');
INSERT INTO "auth_permission" VALUES(30,'Can change msg',10,'change_msg');
INSERT INTO "auth_permission" VALUES(31,'Can delete msg',10,'delete_msg');
INSERT INTO "auth_permission" VALUES(32,'Can add model file',11,'add_modelfile');
INSERT INTO "auth_permission" VALUES(33,'Can change model file',11,'change_modelfile');
INSERT INTO "auth_permission" VALUES(34,'Can delete model file',11,'delete_modelfile');
INSERT INTO "auth_permission" VALUES(35,'Can add model type',12,'add_modeltype');
INSERT INTO "auth_permission" VALUES(36,'Can change model type',12,'change_modeltype');
INSERT INTO "auth_permission" VALUES(37,'Can delete model type',12,'delete_modeltype');
INSERT INTO "auth_permission" VALUES(38,'Can add model data',13,'add_modeldata');
INSERT INTO "auth_permission" VALUES(39,'Can change model data',13,'change_modeldata');
INSERT INTO "auth_permission" VALUES(40,'Can delete model data',13,'delete_modeldata');
INSERT INTO "auth_permission" VALUES(41,'Can add scene data',14,'add_scenedata');
INSERT INTO "auth_permission" VALUES(42,'Can change scene data',14,'change_scenedata');
INSERT INTO "auth_permission" VALUES(43,'Can delete scene data',14,'delete_scenedata');
INSERT INTO "auth_permission" VALUES(44,'Can add scene draft',15,'add_scenedraft');
INSERT INTO "auth_permission" VALUES(45,'Can change scene draft',15,'change_scenedraft');
INSERT INTO "auth_permission" VALUES(46,'Can delete scene draft',15,'delete_scenedraft');
CREATE TABLE "auth_group_permissions" (
    "id" integer NOT NULL PRIMARY KEY,
    "group_id" integer NOT NULL,
    "permission_id" integer NOT NULL REFERENCES "auth_permission" ("id"),
    UNIQUE ("group_id", "permission_id")
);
CREATE TABLE "auth_group" (
    "id" integer NOT NULL PRIMARY KEY,
    "name" varchar(80) NOT NULL UNIQUE
);
CREATE TABLE "auth_user_groups" (
    "id" integer NOT NULL PRIMARY KEY,
    "user_id" integer NOT NULL,
    "group_id" integer NOT NULL REFERENCES "auth_group" ("id"),
    UNIQUE ("user_id", "group_id")
);
CREATE TABLE "auth_user_user_permissions" (
    "id" integer NOT NULL PRIMARY KEY,
    "user_id" integer NOT NULL,
    "permission_id" integer NOT NULL REFERENCES "auth_permission" ("id"),
    UNIQUE ("user_id", "permission_id")
);
CREATE TABLE "auth_user" (
    "id" integer NOT NULL PRIMARY KEY,
    "password" varchar(128) NOT NULL,
    "last_login" datetime NOT NULL,
    "is_superuser" bool NOT NULL,
    "username" varchar(30) NOT NULL UNIQUE,
    "first_name" varchar(30) NOT NULL,
    "last_name" varchar(30) NOT NULL,
    "email" varchar(75) NOT NULL,
    "is_staff" bool NOT NULL,
    "is_active" bool NOT NULL,
    "date_joined" datetime NOT NULL
);
INSERT INTO "auth_user" VALUES(1,'pbkdf2_sha256$10000$QwZzZUVF3wyl$aQV6eF+1Z/vQ57ojHBAaX6svl0ZJrkygLEi7bX+0HWk=','2013-05-12 07:25:54.902238',1,'admin','','','517876024@qq.com',1,1,'2013-03-22 06:12:26');
INSERT INTO "auth_user" VALUES(2,'pbkdf2_sha256$10000$Z1FWG2JmeyA9$bPniwIAk47ztt40sEUwtdAapLojWjTvZF35itx9Nomg=','2013-05-10 01:31:35.491000',0,'qy','','','123@qq.com',0,1,'2013-03-22 06:26:07.990000');
CREATE TABLE "django_content_type" (
    "id" integer NOT NULL PRIMARY KEY,
    "name" varchar(100) NOT NULL,
    "app_label" varchar(100) NOT NULL,
    "model" varchar(100) NOT NULL,
    UNIQUE ("app_label", "model")
);
INSERT INTO "django_content_type" VALUES(1,'permission','auth','permission');
INSERT INTO "django_content_type" VALUES(2,'group','auth','group');
INSERT INTO "django_content_type" VALUES(3,'user','auth','user');
INSERT INTO "django_content_type" VALUES(4,'content type','contenttypes','contenttype');
INSERT INTO "django_content_type" VALUES(5,'session','sessions','session');
INSERT INTO "django_content_type" VALUES(6,'site','sites','site');
INSERT INTO "django_content_type" VALUES(7,'comment','comments','comment');
INSERT INTO "django_content_type" VALUES(8,'comment flag','comments','commentflag');
INSERT INTO "django_content_type" VALUES(9,'log entry','admin','logentry');
INSERT INTO "django_content_type" VALUES(10,'msg','message','msg');
INSERT INTO "django_content_type" VALUES(11,'model file','management','modelfile');
INSERT INTO "django_content_type" VALUES(12,'model type','management','modeltype');
INSERT INTO "django_content_type" VALUES(13,'model data','management','modeldata');
INSERT INTO "django_content_type" VALUES(14,'scene data','scene','scenedata');
INSERT INTO "django_content_type" VALUES(15,'scene draft','scene','scenedraft');
CREATE TABLE "django_session" (
    "session_key" varchar(40) NOT NULL PRIMARY KEY,
    "session_data" text NOT NULL,
    "expire_date" datetime NOT NULL
);
INSERT INTO "django_session" VALUES('fj0tqh4b5rd3uitwj1kzc5gr1ngm7tkn','ZTEwMTg5ZGRlZWM5ODM5NjNmODJlZWVjNDg5ZjE4YTQ2NzFiZWE1YzqAAn1xAShVEl9hdXRoX3VzZXJfYmFja2VuZHECVSlkamFuZ28uY29udHJpYi5hdXRoLmJhY2tlbmRzLk1vZGVsQmFja2VuZHEDVQ1fYXV0aF91c2VyX2lkcQRLAnUu','2013-04-08 05:48:23.180000');
INSERT INTO "django_session" VALUES('s2k0exy0wclosgcv9aaqore623xn6xwi','YzMyOGUwYjYwYzMxNDVhZjM1MWJiYjNhNzAzZWJiOGE3YWFlNDk4OTqAAn1xAS4=','2013-04-09 01:25:07.727000');
INSERT INTO "django_session" VALUES('x4kmpj6r2dr287nk059vpcgug0288ohw','ZTEwMTg5ZGRlZWM5ODM5NjNmODJlZWVjNDg5ZjE4YTQ2NzFiZWE1YzqAAn1xAShVEl9hdXRoX3VzZXJfYmFja2VuZHECVSlkamFuZ28uY29udHJpYi5hdXRoLmJhY2tlbmRzLk1vZGVsQmFja2VuZHEDVQ1fYXV0aF91c2VyX2lkcQRLAnUu','2013-04-09 02:53:00.735000');
INSERT INTO "django_session" VALUES('bih2bum8jzqzuq8wgm7vfgamxzpn3tuj','MmYxYjZlZGRhNmRjMjUzMjcxMDI0ZWFlOGNhNWVlOTNhZGQ2N2Y4YzqAAn1xAShVEl9hdXRoX3VzZXJfYmFja2VuZHECVSlkamFuZ28uY29udHJpYi5hdXRoLmJhY2tlbmRzLk1vZGVsQmFja2VuZHEDVQ1fYXV0aF91c2VyX2lkcQRLAXUu','2013-05-02 01:16:46.693000');
INSERT INTO "django_session" VALUES('re6dbq1t42toc5jxqcqldk09t1m3rmli','ZWYzYWM4OTU5NGMzMTQ0ZmIyMzc4OWNiYTFiYzRjZWMyZWQ0ZDExMzqAAn1xAShYCgAAAHRlc3Rjb29raWVxAlgGAAAAd29ya2VkcQNVDV9hdXRoX3VzZXJfaWRLAVUSX2F1dGhfdXNlcl9iYWNrZW5kVSlkamFuZ28uY29udHJpYi5hdXRoLmJhY2tlbmRzLk1vZGVsQmFja2VuZHUu','2013-05-05 04:55:03.396000');
INSERT INTO "django_session" VALUES('xpvrl129yt4i2a5lxy82h6a4symzlvlg','MmYxYjZlZGRhNmRjMjUzMjcxMDI0ZWFlOGNhNWVlOTNhZGQ2N2Y4YzqAAn1xAShVEl9hdXRoX3VzZXJfYmFja2VuZHECVSlkamFuZ28uY29udHJpYi5hdXRoLmJhY2tlbmRzLk1vZGVsQmFja2VuZHEDVQ1fYXV0aF91c2VyX2lkcQRLAXUu','2013-05-09 07:22:39.799000');
INSERT INTO "django_session" VALUES('767d650033ce0cbba5264fd07ba12d84','MmYxYjZlZGRhNmRjMjUzMjcxMDI0ZWFlOGNhNWVlOTNhZGQ2N2Y4YzqAAn1xAShVEl9hdXRoX3Vz
ZXJfYmFja2VuZHECVSlkamFuZ28uY29udHJpYi5hdXRoLmJhY2tlbmRzLk1vZGVsQmFja2VuZHED
VQ1fYXV0aF91c2VyX2lkcQRLAXUu
','2013-05-09 11:17:48.757493');
INSERT INTO "django_session" VALUES('61425a63ff10fa757a540844d4f4cf15','MmYxYjZlZGRhNmRjMjUzMjcxMDI0ZWFlOGNhNWVlOTNhZGQ2N2Y4YzqAAn1xAShVEl9hdXRoX3Vz
ZXJfYmFja2VuZHECVSlkamFuZ28uY29udHJpYi5hdXRoLmJhY2tlbmRzLk1vZGVsQmFja2VuZHED
VQ1fYXV0aF91c2VyX2lkcQRLAXUu
','2013-05-19 06:45:14.174706');
INSERT INTO "django_session" VALUES('71081077b05f38828c820082575e95fd','MmYxYjZlZGRhNmRjMjUzMjcxMDI0ZWFlOGNhNWVlOTNhZGQ2N2Y4YzqAAn1xAShVEl9hdXRoX3Vz
ZXJfYmFja2VuZHECVSlkamFuZ28uY29udHJpYi5hdXRoLmJhY2tlbmRzLk1vZGVsQmFja2VuZHED
VQ1fYXV0aF91c2VyX2lkcQRLAXUu
','2013-05-21 14:58:22.831528');
INSERT INTO "django_session" VALUES('5yvgvwgwfumj0yim03s2dfkb4kdumtcv','ZTEwMTg5ZGRlZWM5ODM5NjNmODJlZWVjNDg5ZjE4YTQ2NzFiZWE1YzqAAn1xAShVEl9hdXRoX3VzZXJfYmFja2VuZHECVSlkamFuZ28uY29udHJpYi5hdXRoLmJhY2tlbmRzLk1vZGVsQmFja2VuZHEDVQ1fYXV0aF91c2VyX2lkcQRLAnUu','2013-05-22 05:40:43.475000');
INSERT INTO "django_session" VALUES('gx53mr46clhyeth1obqbkal5lfairswa','ZTEwMTg5ZGRlZWM5ODM5NjNmODJlZWVjNDg5ZjE4YTQ2NzFiZWE1YzqAAn1xAShVEl9hdXRoX3VzZXJfYmFja2VuZHECVSlkamFuZ28uY29udHJpYi5hdXRoLmJhY2tlbmRzLk1vZGVsQmFja2VuZHEDVQ1fYXV0aF91c2VyX2lkcQRLAnUu','2013-05-24 01:31:35.601000');
INSERT INTO "django_session" VALUES('c80a29c0ab93a11990ecffd1ab4841ac','MmYxYjZlZGRhNmRjMjUzMjcxMDI0ZWFlOGNhNWVlOTNhZGQ2N2Y4YzqAAn1xAShVEl9hdXRoX3Vz
ZXJfYmFja2VuZHECVSlkamFuZ28uY29udHJpYi5hdXRoLmJhY2tlbmRzLk1vZGVsQmFja2VuZHED
VQ1fYXV0aF91c2VyX2lkcQRLAXUu
','2013-05-25 14:36:11.450537');
INSERT INTO "django_session" VALUES('f2edf4a02f2f34ece4bd18fc03f59972','MmYxYjZlZGRhNmRjMjUzMjcxMDI0ZWFlOGNhNWVlOTNhZGQ2N2Y4YzqAAn1xAShVEl9hdXRoX3Vz
ZXJfYmFja2VuZHECVSlkamFuZ28uY29udHJpYi5hdXRoLmJhY2tlbmRzLk1vZGVsQmFja2VuZHED
VQ1fYXV0aF91c2VyX2lkcQRLAXUu
','2013-05-26 07:25:54.918182');
CREATE TABLE "django_site" (
    "id" integer NOT NULL PRIMARY KEY,
    "domain" varchar(100) NOT NULL,
    "name" varchar(50) NOT NULL
);
INSERT INTO "django_site" VALUES(1,'example.com','example.com');
CREATE TABLE "django_comments" (
    "id" integer NOT NULL PRIMARY KEY,
    "content_type_id" integer NOT NULL REFERENCES "django_content_type" ("id"),
    "object_pk" text NOT NULL,
    "site_id" integer NOT NULL REFERENCES "django_site" ("id"),
    "user_id" integer REFERENCES "auth_user" ("id"),
    "user_name" varchar(50) NOT NULL,
    "user_email" varchar(75) NOT NULL,
    "user_url" varchar(200) NOT NULL,
    "comment" text NOT NULL,
    "submit_date" datetime NOT NULL,
    "ip_address" char(15),
    "is_public" bool NOT NULL,
    "is_removed" bool NOT NULL
);
INSERT INTO "django_comments" VALUES(1,10,'1',1,2,'qy','123@qq.com','','<p>I love python!</p>','2013-03-22 06:30:08.239000','127.0.0.1',1,0);
INSERT INTO "django_comments" VALUES(2,10,'6',1,2,'qy','123@qq.com','','<p>wedwedw</p>','2013-03-24 01:43:35.506000','127.0.0.1',1,0);
INSERT INTO "django_comments" VALUES(3,10,'6',1,2,'qy','123@qq.com','','<p>ertrft4</p>','2013-03-24 01:56:49.577000','127.0.0.1',1,0);
INSERT INTO "django_comments" VALUES(4,10,'6',1,1,'admin','517876024@qq.com','','<p>f<img title="Frown" src="../../site_media/js/tiny_mce/plugins/emotions/img/smiley-frown.gif" alt="Frown" border="0" /></p>','2013-03-24 02:42:45.015000','127.0.0.1',1,0);
INSERT INTO "django_comments" VALUES(5,10,'8',1,1,'admin','517876024@qq.com','','<p>Me too!<img title="Cry" src="../../site_media/js/tiny_mce/plugins/emotions/img/smiley-cry.gif" alt="Cry" border="0" /></p>','2013-03-24 02:53:06.914000','127.0.0.1',1,0);
INSERT INTO "django_comments" VALUES(6,10,'6',1,2,'qy','123@qq.com','','<p>ewdas</p>','2013-03-25 06:18:05.722000','127.0.0.1',1,0);
INSERT INTO "django_comments" VALUES(7,10,'9',1,2,'qy','123@qq.com','','<p style="text-align: left;">Hello <span style="font-family: ''arial black'', ''avant garde'';">too!<img title="Tongue Out" src="../../site_media/js/tiny_mce/plugins/emotions/img/smiley-tongue-out.gif" alt="Tongue Out" border="0" /></span></p>','2013-03-25 06:29:40.530000','127.0.0.1',1,0);
INSERT INTO "django_comments" VALUES(8,10,'6',1,2,'qy','123@qq.com','','<p>hello<img title="Kiss" src="../../site_media/js/tiny_mce/plugins/emotions/img/smiley-kiss.gif" alt="Kiss" border="0" /></p>','2013-03-25 06:33:41.876000','127.0.0.1',1,0);
INSERT INTO "django_comments" VALUES(9,10,'6',1,2,'qy','123@qq.com','','<p>dear!<img title="Surprised" src="../../site_media/js/tiny_mce/plugins/emotions/img/smiley-surprised.gif" alt="Surprised" border="0" /></p>','2013-03-25 06:34:19.887000','127.0.0.1',1,0);
INSERT INTO "django_comments" VALUES(10,10,'6',1,2,'qy','123@qq.com','','<p>wefgjdfwe</p>','2013-03-25 08:27:29.081000','127.0.0.1',1,0);
INSERT INTO "django_comments" VALUES(11,10,'13',1,1,'admin','517876024@qq.com','','<p>hiasdhws</p>','2013-04-23 08:33:16.640000','127.0.0.1',1,0);
INSERT INTO "django_comments" VALUES(12,14,'8',1,1,'admin','517876024@qq.com','','<p>efsfw</p>','2013-05-08 05:25:47.048000','127.0.0.1',1,0);
INSERT INTO "django_comments" VALUES(13,14,'9',1,2,'qy','123@qq.com','','<p>hello</p>','2013-05-08 05:31:39.327000','127.0.0.1',1,0);
INSERT INTO "django_comments" VALUES(14,14,'6',1,1,'admin','517876024@qq.com','','<p>12133</p>','2013-05-09 01:37:51.210350','127.0.0.1',1,0);
INSERT INTO "django_comments" VALUES(15,14,'6',1,1,'admin','517876024@qq.com','','<p>12341adasd</p>','2013-05-09 01:38:01.841243','127.0.0.1',1,0);
INSERT INTO "django_comments" VALUES(16,14,'6',1,1,'admin','517876024@qq.com','','<p>&lt;script&gt;alert(1)&lt;/script&gt;</p>','2013-05-09 01:38:13.274936','127.0.0.1',1,0);
INSERT INTO "django_comments" VALUES(17,14,'22',1,1,'admin','517876024@qq.com','','<p>asda13</p>','2013-05-09 05:35:17.638492','127.0.0.1',1,0);
INSERT INTO "django_comments" VALUES(18,14,'24',1,1,'admin','517876024@qq.com','','<p>adasda</p>','2013-05-09 05:39:21.801079','127.0.0.1',1,0);
INSERT INTO "django_comments" VALUES(19,14,'29',1,1,'admin','517876024@qq.com','','<p>asd1234</p>','2013-05-09 07:02:32.508246','127.0.0.1',1,0);
INSERT INTO "django_comments" VALUES(20,10,'14',1,2,'qy','123@qq.com','','<p>hello</p>','2013-05-12 02:21:50.161000','127.0.0.1',1,0);
INSERT INTO "django_comments" VALUES(21,14,'30',1,2,'qy','123@qq.com','','<p>dfbdfd</p>','2013-05-12 02:30:05.857000','127.0.0.1',1,0);
CREATE TABLE "django_comment_flags" (
    "id" integer NOT NULL PRIMARY KEY,
    "user_id" integer NOT NULL REFERENCES "auth_user" ("id"),
    "comment_id" integer NOT NULL REFERENCES "django_comments" ("id"),
    "flag" varchar(30) NOT NULL,
    "flag_date" datetime NOT NULL,
    UNIQUE ("user_id", "comment_id", "flag")
);
CREATE TABLE "django_admin_log" (
    "id" integer NOT NULL PRIMARY KEY,
    "action_time" datetime NOT NULL,
    "user_id" integer NOT NULL REFERENCES "auth_user" ("id"),
    "content_type_id" integer REFERENCES "django_content_type" ("id"),
    "object_id" text,
    "object_repr" varchar(200) NOT NULL,
    "action_flag" smallint unsigned NOT NULL,
    "change_message" text NOT NULL
);
INSERT INTO "django_admin_log" VALUES(1,'2013-03-24 02:40:43.964000',1,10,'7','User qy comments on: Emotion',2,'Changed content.');
INSERT INTO "django_admin_log" VALUES(2,'2013-03-24 02:43:15.525000',1,3,'1','admin',2,'Changed password and email.');
INSERT INTO "django_admin_log" VALUES(3,'2013-03-26 01:37:42.453000',1,11,'1','test',1,'');
INSERT INTO "django_admin_log" VALUES(4,'2013-03-26 01:38:10.995000',1,11,'1','test',2,'No fields changed.');
INSERT INTO "django_admin_log" VALUES(5,'2013-03-26 01:39:08.949000',1,11,'2','test2',1,'');
INSERT INTO "django_admin_log" VALUES(6,'2013-03-26 01:40:55.053000',1,11,'3','test3',1,'');
INSERT INTO "django_admin_log" VALUES(7,'2013-03-26 01:41:19.343000',1,11,'1','test',3,'');
INSERT INTO "django_admin_log" VALUES(8,'2013-03-26 01:41:23.835000',1,11,'2','test2',3,'');
INSERT INTO "django_admin_log" VALUES(9,'2013-04-18 01:20:28.616000',1,11,'4','test',1,'');
INSERT INTO "django_admin_log" VALUES(10,'2013-04-18 02:08:32.162000',1,12,'1','ModelType object',1,'');
INSERT INTO "django_admin_log" VALUES(11,'2013-04-18 02:10:07.955000',1,12,'2','wall',1,'');
INSERT INTO "django_admin_log" VALUES(12,'2013-04-18 02:11:52.859000',1,13,'1','testDoor',1,'');
INSERT INTO "django_admin_log" VALUES(13,'2013-04-20 07:32:36.679000',1,13,'2','wew',1,'');
INSERT INTO "django_admin_log" VALUES(14,'2013-04-20 08:02:01.561000',1,13,'3','test',1,'');
INSERT INTO "django_admin_log" VALUES(15,'2013-04-20 08:02:14.587000',1,13,'1','testDoor',2,'Changed rotation_x, rotation_y and rotation_z.');
INSERT INTO "django_admin_log" VALUES(16,'2013-04-20 08:02:22.923000',1,13,'2','wew',2,'Changed rotation_x, rotation_y and rotation_z.');
INSERT INTO "django_admin_log" VALUES(17,'2013-05-09 02:58:46.964588',1,12,'3','furniture',1,'');
INSERT INTO "django_admin_log" VALUES(18,'2013-05-09 02:59:20.583044',1,13,'4','desk',1,'');
INSERT INTO "django_admin_log" VALUES(19,'2013-05-09 03:01:43.873921',1,13,'5','sofa',1,'');
INSERT INTO "django_admin_log" VALUES(20,'2013-05-09 03:16:59.919601',1,13,'6','tv',1,'');
INSERT INTO "django_admin_log" VALUES(21,'2013-05-15 02:23:39.691310',1,13,'7','sofa_001',1,'');
INSERT INTO "django_admin_log" VALUES(22,'2013-05-15 02:24:15.271257',1,13,'2','wew',3,'');
INSERT INTO "django_admin_log" VALUES(23,'2013-05-15 02:24:20.965676',1,13,'3','test',3,'');
INSERT INTO "django_admin_log" VALUES(24,'2013-05-15 02:24:26.917487',1,13,'1','testDoor',3,'');
CREATE TABLE "message_msg" (
    "id" integer NOT NULL PRIMARY KEY,
    "title" varchar(30) NOT NULL,
    "content" text NOT NULL,
    "user_id" integer NOT NULL REFERENCES "auth_user" ("id"),
    "ip" char(15) NOT NULL,
    "datetime" datetime NOT NULL,
    "clickcount" integer NOT NULL
);
INSERT INTO "message_msg" VALUES(1,'Python','<p>Python is good!</p>',2,'127.0.0.1','2013-03-22 06:26:35.876000',2);
INSERT INTO "message_msg" VALUES(2,'Ajax','<p>Ajax is good!<img title="Cool" src="../site_media/js/tiny_mce/plugins/emotions/img/smiley-cool.gif" alt="Cool" border="0" /></p>',2,'127.0.0.1','2013-03-22 06:28:11.835000',1);
INSERT INTO "message_msg" VALUES(3,'Java','<p>Java is huge!</p>',2,'127.0.0.1','2013-03-22 06:30:33.802000',1);
INSERT INTO "message_msg" VALUES(4,'Sunny Day','<p>What a sunny day! I love it!</p>',2,'127.0.0.1','2013-03-23 04:42:12.092000',3);
INSERT INTO "message_msg" VALUES(5,'Admin','<p>I am admin!</p>',1,'127.0.0.1','2013-03-24 01:24:37.382000',2);
INSERT INTO "message_msg" VALUES(6,'Rainy','<p>What a rainy day!</p>',1,'127.0.0.1','2013-03-24 01:25:03.438000',146);
INSERT INTO "message_msg" VALUES(7,'Emotion','<p>smile<img title="Smile" src="/site_media/js/tiny_mce/plugins/emotions/img/smiley-smile.gif" alt="Smile" border="0" /></p>',2,'127.0.0.1','2013-03-24 02:29:14.983000',22);
INSERT INTO "message_msg" VALUES(8,'Cry','<p>I am upsad!<img title="Cry" src="../site_media/js/tiny_mce/plugins/emotions/img/smiley-cry.gif" alt="Cry" border="0" /></p>',1,'127.0.0.1','2013-03-24 02:46:51.452000',52);
INSERT INTO "message_msg" VALUES(9,'Hello again','<p>Hello <span style="text-decoration: underline;"><em><strong>world!<img title="Smile" src="../site_media/js/tiny_mce/plugins/emotions/img/smiley-smile.gif" alt="Smile" border="0" /></strong></em></span></p>',2,'127.0.0.1','2013-03-24 08:35:45.861000',82);
INSERT INTO "message_msg" VALUES(11,'Test link2','<p><a href="../">link to home</a></p>',2,'127.0.0.1','2013-03-25 07:30:16.702000',16);
INSERT INTO "message_msg" VALUES(14,'12314','<p>阿三大赛打</p>',1,'127.0.0.1','2013-05-06 06:16:52.600423',10);
CREATE TABLE "management_modelfile" (
    "id" integer NOT NULL PRIMARY KEY,
    "title" varchar(30) NOT NULL,
    "file" varchar(100) NOT NULL,
    "date_time" datetime NOT NULL,
    "description" text NOT NULL
);
INSERT INTO "management_modelfile" VALUES(3,'test3','models/manage.py','2013-03-26 01:40:55.051000','wed3');
INSERT INTO "management_modelfile" VALUES(4,'test','models/login.html','2013-04-18 01:20:28.614000','ewewe');
CREATE TABLE "management_modeltype" (
    "id" integer NOT NULL PRIMARY KEY,
    "name" varchar(30) NOT NULL
);
INSERT INTO "management_modeltype" VALUES(1,'door');
INSERT INTO "management_modeltype" VALUES(2,'wall');
INSERT INTO "management_modeltype" VALUES(3,'furniture');
ANALYZE sqlite_master;
CREATE TABLE scene_scenedraft (
    "id" INTEGER PRIMARY KEY NOT NULL,
    "title" VARCHAR(30) NOT NULL,
    "time" DATETIME NOT NULL,
    "description" VARCHAR(300) NOT NULL,
    "content3" TEXT NOT NULL,
    "author_id" INTEGER NOT NULL,
    "scene_id" INTEGER,
    "image_url" TEXT,
    "content2" TEXT NOT NULL
);
INSERT INTO "scene_scenedraft" VALUES(1,'asd14','2013-05-09 05:37:58.733449','','{"rooms":[],"walls":[],"furnitures":[]}',1,23,NULL,'{"points":[],"walls":[],"rooms":[],"furnitures":[]}');
CREATE TABLE management_modeldata (
    "id" INTEGER PRIMARY KEY NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "type_id" INTEGER NOT NULL,
    "model_url" VARCHAR(100) NOT NULL,
    "image_url" VARCHAR(100) NOT NULL,
    "icon_url" VARCHAR(100) NOT NULL,
    "scale_x" REAL NOT NULL,
    "scale_y" REAL NOT NULL,
    "scale_z" REAL NOT NULL,
    "x" REAL NOT NULL,
    "y" REAL NOT NULL,
    "z" REAL NOT NULL,
    "rotation_x" REAL NOT NULL,
    "rotation_y" REAL NOT NULL,
    "rotation_z" REAL NOT NULL,
    "baseY" REAL
);
INSERT INTO "management_modeldata" VALUES(4,'desk',3,'models/office_desk.dae','images/untitled.png','icons/untitled.png',1.0,1.0,1.0,6.553,2.934,6.559,1.57,0.0,0.0,NULL);
INSERT INTO "management_modeldata" VALUES(5,'sofa',3,'models/blenderess_sofa_4seater1.dae','images/sofa_img.jpg','icons/sofa_img.jpg',1.0,1.0,1.0,6.537,2.934,6.559,1.57,0.0,0.0,NULL);
INSERT INTO "management_modeldata" VALUES(6,'tv',3,'models/TV.dae','images/tv.jpg','icons/tv.jpg',1.0,1.0,1.0,2.0,2.0,2.0,1.57,0.0,0.0,NULL);
INSERT INTO "management_modeldata" VALUES(7,'sofa_001',3,'models/blenderess_sofa_4seater1_2.dae','images/sofa_img_2.jpg','icons/sofa3_2.png',1.0,1.0,1.0,3.125,0.93,0.976,-1.57,0.0,0.0,2.6);
CREATE TABLE scene_scenedata (
    "id" INTEGER PRIMARY KEY NOT NULL,
    "title" VARCHAR(30) NOT NULL,
    "time" DATETIME NOT NULL,
    "description" VARCHAR(300) NOT NULL,
    "content3" TEXT NOT NULL,
    "author_id" INTEGER NOT NULL,
    "img_url" TEXT NOT NULL,
    "view_count" INTEGER DEFAULT (0),
    "content2" TEXT NOT NULL
);
INSERT INTO "scene_scenedata" VALUES(1,'title','2013-05-17 05:00:00','<p>ashdajshd</p>','{"rooms":[{"points":[{"x":86,"y":45},{"x":385,"y":45},{"x":385,"y":203},{"x":86,"y":203}]},{"points":[{"x":385,"y":45},{"x":612,"y":45},{"x":612,"y":365},{"x":385,"y":365},{"x":385,"y":203}]}],"walls":[{"doors":[],"windows":[],"points":[{"x":86,"y":45},{"x":385,"y":45}]},{"doors":[],"windows":[],"points":[{"x":385,"y":45},{"x":385,"y":203}]},{"doors":[],"windows":[],"points":[{"x":385,"y":203},{"x":86,"y":203}]},{"doors":[],"windows":[],"points":[{"x":86,"y":203},{"x":86,"y":45}]},{"doors":[],"windows":[],"points":[{"x":385,"y":45},{"x":612,"y":45}]},{"doors":[],"windows":[],"points":[{"x":612,"y":45},{"x":612,"y":365}]},{"doors":[],"windows":[],"points":[{"x":612,"y":365},{"x":385,"y":365}]},{"doors":[],"windows":[],"points":[{"x":385,"y":365},{"x":385,"y":203}]}],"furnitures":[]}',1,'data:image/png;base64,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',NULL,'{"points":[{"x":86,"y":45},{"x":385,"y":45},{"x":385,"y":203},{"x":86,"y":203},{"x":612,"y":45},{"x":612,"y":365},{"x":385,"y":365}],"walls":[{"doors":[],"windows":[],"points":[0,1]},{"doors":[],"windows":[],"points":[1,2]},{"doors":[],"windows":[],"points":[2,3]},{"doors":[],"windows":[],"points":[3,0]},{"doors":[],"windows":[],"points":[1,4]},{"doors":[],"windows":[],"points":[4,5]},{"doors":[],"windows":[],"points":[5,6]},{"doors":[],"windows":[],"points":[6,2]}],"rooms":[{"corner_indexs":[0,1,2,3],"wall_indexs":[0,1,2,3]},{"corner_indexs":[1,4,5,6,2],"wall_indexs":[4,5,6,7,1]}],"furnitures":[]}');
CREATE INDEX "auth_permission_37ef4eb4" ON "auth_permission" ("content_type_id");
CREATE INDEX "auth_group_permissions_5f412f9a" ON "auth_group_permissions" ("group_id");
CREATE INDEX "auth_group_permissions_83d7f98b" ON "auth_group_permissions" ("permission_id");
CREATE INDEX "auth_user_groups_6340c63c" ON "auth_user_groups" ("user_id");
CREATE INDEX "auth_user_groups_5f412f9a" ON "auth_user_groups" ("group_id");
CREATE INDEX "auth_user_user_permissions_6340c63c" ON "auth_user_user_permissions" ("user_id");
CREATE INDEX "auth_user_user_permissions_83d7f98b" ON "auth_user_user_permissions" ("permission_id");
CREATE INDEX "django_session_b7b81f0c" ON "django_session" ("expire_date");
CREATE INDEX "django_comments_37ef4eb4" ON "django_comments" ("content_type_id");
CREATE INDEX "django_comments_99732b5c" ON "django_comments" ("site_id");
CREATE INDEX "django_comments_6340c63c" ON "django_comments" ("user_id");
CREATE INDEX "django_comment_flags_6340c63c" ON "django_comment_flags" ("user_id");
CREATE INDEX "django_comment_flags_3925f323" ON "django_comment_flags" ("comment_id");
CREATE INDEX "django_comment_flags_9f00eb17" ON "django_comment_flags" ("flag");
CREATE INDEX "django_admin_log_6340c63c" ON "django_admin_log" ("user_id");
CREATE INDEX "django_admin_log_37ef4eb4" ON "django_admin_log" ("content_type_id");
CREATE INDEX "message_msg_6340c63c" ON "message_msg" ("user_id");
CREATE INDEX "scene_scenedata_e969df21" ON "scene_scenedata" ("author_id");
COMMIT;
