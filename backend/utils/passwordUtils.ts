import bcrypt from 'bcrypt';

export async function hashPassword(plaintextPassword) {
    return bcrypt.hash(plaintextPassword, 10);
}

export async function comparePassword(plaintextPassword, hash) {
    const result = await bcrypt.compare(plaintextPassword, hash);
    return result;
}