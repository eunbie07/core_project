db = db.getSiblingDB('emotions');
db.logs.insertOne({ message: "MongoDB 초기화 성공", timestamp: new Date() });
