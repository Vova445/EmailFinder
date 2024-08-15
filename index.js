import fs from 'fs';
const users = JSON.parse(fs.readFileSync('users.json', 'utf8'));
const sampleData = JSON.parse(fs.readFileSync('sample_data.json', 'utf8'));
const uniqueUsers = Array.from(new Set(users.map(user => JSON.stringify(user)))).map(user => JSON.parse(user));

const recognized = [];
const notRecognized = [];

function normalizeEmail(email, method = 1) {
    if (method === 1) {
        return email.replace(/[0-9]/g, '').replace(/[@.]/g, '');
    } else {
        return email.replace(/[0-9]/g, '').toLowerCase().split('@')[0];
    }
}
uniqueUsers.forEach(user => {
    const userEmailNorm1 = normalizeEmail(user.email, 1);
    const userEmailNorm2 = normalizeEmail(user.email, 2);
    const relatedEmails = [];

    sampleData.forEach(entry => {
        const email = entry.account_email || entry.email;
        if (email) {
            const emailNorm1 = normalizeEmail(email, 1);
            const emailNorm2 = normalizeEmail(email, 2);

            if (emailNorm1.includes(userEmailNorm1) || emailNorm2.includes(userEmailNorm2)) {
                relatedEmails.push(email);
            }
        }
    });

    if (relatedEmails.length > 0) {
        recognized.push({
            user_email: user.email,
            related_emails: relatedEmails
        });
    } else {
        notRecognized.push(user.email);
    }
});

const result = {
    recognized,
    not_recognized: notRecognized
};

fs.writeFileSync('output.json', JSON.stringify(result, null, 2), 'utf8');

console.log('Результат збережено в output.json');
console.log('Recognized: ', recognized.length);
console.log('Not Recognized: ', notRecognized.length);
