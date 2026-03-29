<?php
/**
 * Contact form handler for Batoor AlWatan Technical Services LLC.
 * Configure SMTP or mail() in php.ini for production delivery.
 */

header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'message' => 'Method not allowed.']);
    exit;
}

// Honeypot
if (!empty($_POST['website'] ?? '')) {
    echo json_encode(['ok' => true, 'message' => 'Thank you.']);
    exit;
}

$name = trim((string) ($_POST['name'] ?? ''));
$phone = trim((string) ($_POST['phone'] ?? ''));
$email = trim((string) ($_POST['email'] ?? ''));
$service = trim((string) ($_POST['service'] ?? ''));
$message = trim((string) ($_POST['message'] ?? ''));

if ($name === '' || $phone === '' || $email === '' || $message === '') {
    http_response_code(400);
    echo json_encode(['ok' => false, 'message' => 'Please fill in all required fields.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'message' => 'Please enter a valid email address.']);
    exit;
}

$to = 'batoor480@gmail.com';
$subject = 'Website inquiry - Batoor AlWatan - ' . mb_substr($name, 0, 60);

$body = "New contact form submission\r\n\r\n";
$body .= "Name: {$name}\r\n";
$body .= "Phone: {$phone}\r\n";
$body .= "Email: {$email}\r\n";
$body .= 'Service: ' . ($service !== '' ? $service : '(not specified)') . "\r\n\r\n";
$body .= "Message:\r\n{$message}\r\n";

$headers = [
    'From: noreply@localhost',
    'Reply-To: ' . $email,
    'X-Mailer: PHP/' . PHP_VERSION,
    'Content-Type: text/plain; charset=UTF-8',
];

$subjectEncoded = '=?UTF-8?B?' . base64_encode($subject) . '?=';
$sent = @mail($to, $subjectEncoded, $body, implode("\r\n", $headers));

if ($sent) {
    echo json_encode([
        'ok' => true,
        'message' => 'Thank you — your message was sent. We will contact you soon.',
    ]);
} else {
    echo json_encode([
        'ok' => true,
        'message' => 'Thank you — we received your details. If email is not configured on this server, please WhatsApp or call us directly.',
    ]);
}
