const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: true
    },
    lastSeen: {
        type: Date,
    },
    isOnline: {
        type: Boolean,
        default: false,
    }
});

userSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function(plainPassword) {
    return bcrypt.compare(plainPassword, this.password);
};

module.exports =
    mongoose.models.User || mongoose.model('User', userSchema);
