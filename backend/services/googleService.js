import Imap from 'imap';
import { simpleParser } from 'mailparser';

const imapConfig = {
    user: undefined, 
    password: undefined,
    host: 'imap.gmail.com', 
    port: 993, 
    tls: true,
    tlsOptions: {
        rejectUnauthorized: false,
    }
};


export const fetchMail = (email,password,count=50) => {
    imapConfig['user'] = email;
    imapConfig['password'] = password;

    return new Promise((resolve, reject) => {
        const imap = new Imap(imapConfig);

        const openInbox = (cb) => {
            imap.openBox('INBOX', true, cb);
        };

        imap.once('ready', () => {
            openInbox((err) => {
                if (err) {
                    reject(`Failed to open inbox: ${err.message}`);
                    imap.end();
                    return;
                }

                // Search for all emails
                imap.search(['ALL'], (err, results) => {
                    if (err) {
                        reject(`Search error: ${err.message}`);
                        imap.end();
                        return;
                    }

                    if (!results || results.length === 0) {
                        resolve([]); // No emails found
                        imap.end();
                        return;
                    }

                    // Get the latest emails based on the count
                    const latestResults = results.slice(-count).reverse();
                    const f = imap.fetch(latestResults, { bodies: '' });

                    const emails = [];

                    f.on('message', (msg) => {
                        let buffer = '';

                        msg.on('body', (stream) => {
                            stream.on('data', (chunk) => {
                                buffer += chunk.toString('utf8');
                            });
                        });

                        msg.once('end', () => {
                            simpleParser(buffer, (err, mail) => {
                                if (err) {
                                    console.error(`Error parsing email: ${err.message}`);
                                } else {
                                    emails.push({
                                        subject: mail.subject || '(No Subject)',
                                        from: mail.from?.text || '(Unknown Sender)',
                                        date: mail.date || '(Unknown Date)',
                                        body: mail.text?.substring(0, 1000) || '(No Content)',
                                        attachments: mail.attachments?.map(att => ({
                                            filename: att.filename,
                                            contentType: att.contentType,
                                            base64Content: att.content.toString('base64')
                                        })) || [],
                                    });
                                }

                                // Resolve the promise when all emails are processed
                                if (emails.length === latestResults.length) {
                                    resolve(emails);
                                    imap.end();
                                }
                            });
                        });
                    });

                    f.once('error', (err) => {
                        reject(`Fetch error: ${err.message}`);
                        imap.end();
                    });

                    f.once('end', () => {
                        console.log('Done fetching emails.');
                    });
                });
            });
        });

        imap.once('error', (err) => {
            reject(`IMAP connection error: ${err.message}`);
        });

        imap.once('end', () => {
            console.log('IMAP connection closed.');
        });

        imap.connect();
    });
};

