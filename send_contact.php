<?php
header('Content-Type: application/json; charset=utf-8');

$to = 'enquiries@noxolodumaphysio.co.za,noxolo@noxolodumaphysio.co.za';
$fromAddress = 'noreply@noxolodumaphysio.co.za';
$fromName = 'Noxolo Duma Physiotherapy';

function val($k) {
    return isset($_POST[$k]) ? trim($_POST[$k]) : '';
}

$name = val('contactName');
$email = val('contactEmail');
$phone = val('contactPhone');
$subjectField = val('contactSubject');
$message = val('contactMessage');
$consent = val('consent');

$remoteIp = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$consentTime = date('c');

if (!$name || !$email || !$message) {
    echo json_encode(['success' => false, 'error' => 'missing_fields']);
    exit;
}
if (strtolower($consent) !== 'yes') {
    echo json_encode(['success' => false, 'error' => 'consent_required']);
    exit;
}

$subject = 'Contact Form: ' . ($subjectField ?: 'General') . ' - ' . $name;

$body = "New contact message from website:\n\n";
$body .= "Name: " . $name . "\n";
$body .= "Email: " . $email . "\n";
$body .= "Phone: " . $phone . "\n";
$body .= "Subject: " . $subjectField . "\n\n";
$body .= "Message:\n" . $message . "\n\n";
$body .= "Sent from: " . ($_SERVER['HTTP_HOST'] ?? 'website') . "\n";
$body .= "Consent: " . ($consent ? $consent : 'no') . "\n";
$body .= "Consent Timestamp: " . $consentTime . "\n";
$body .= "Sender IP: " . $remoteIp . "\n";

if (!file_exists(__DIR__ . '/vendor/autoload.php')) {
    echo json_encode(['success' => false, 'error' => 'phpmailer_missing']);
    exit;
}

require __DIR__ . '/vendor/autoload.php';

$mail = new PHPMailer\PHPMailer\PHPMailer(true);

try {
    $mail->isMail();
    $mail->CharSet = 'UTF-8';

    $mail->setFrom($fromAddress, $fromName);
    foreach (explode(',', $to) as $recipient) {
        $recipient = trim($recipient);
        if ($recipient !== '') {
            $mail->addAddress($recipient);
        }
    }
    if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $mail->addReplyTo($email, $name);
    }

    $mail->Subject = $subject;
    $mail->Body = $body;

    $mail->send();
    echo json_encode(['success' => true]);
    exit;
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => 'mail_failed', 'message' => $e->getMessage()]);
    exit;
}
?>
