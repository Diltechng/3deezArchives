import { pool } from "@/lib/db";


 const userSchema = () =>{
    const query = `CREATE TABLE IF NOT EXISTS
    users(
        id UUID PRIMARY KEY gen_random_uuid(),
        name VARCHAR(100) NOT NULL,
        email UNIQUE VARCHAR(100) NOT NULL,
        phone VARCHAR(11) NOT NULL,
        role VARCHAR(20) NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT NOW()
    )`;
    pool.query(query, ()=> console.log('user schema created sucessfully'))
}

export default userSchema

