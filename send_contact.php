<?php
header('Content-Type: application/json; charset=utf-8');

$to = 'mbhelelindo23@gmail.com';

function val($k) { return isset($_POST[$k]) ? trim($_POST[$k]) : ''; }

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

$subject = "Contact Form: " . ($subjectField ?: 'General') . " — " . $name;

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

$use_smtp = true;
$smtpHost = getenv('SMTP_HOST') ?: 'smtp.example.com';
$smtpUser = getenv('SMTP_USER') ?: 'user@example.com';
$smtpPass = getenv('SMTP_PASS') ?: 'password';
$smtpPort = getenv('SMTP_PORT') ?: 587;
$smtpSecure = getenv('SMTP_SECURE') ?: 'tls';

$fromEmail = filter_var($email, FILTER_VALIDATE_EMAIL) ? $email : ($smtpUser ?: 'no-reply@' . ($_SERVER['SERVER_NAME'] ?? 'localhost'));

if ($use_smtp && file_exists(__DIR__ . '/vendor/autoload.php')) {
    require __DIR__ . '/vendor/autoload.php';
    $mail = new PHPMailer\PHPMailer\PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host       = $smtpHost;
        $mail->SMTPAuth   = true;
        $mail->Username   = $smtpUser;
        $mail->Password   = $smtpPass;
        if (!empty($smtpSecure)) $mail->SMTPSecure = $smtpSecure;
        $mail->Port       = (int)$smtpPort;
        $mail->CharSet    = 'UTF-8';

        $mail->setFrom($smtpUser, 'ND-Physio Website');
        $mail->addAddress($to);
        if (filter_var($email, FILTER_VALIDATE_EMAIL)) $mail->addReplyTo($email, $name);

        $mail->Subject = $subject;
        $mail->Body    = $body;

        $mail->send();
        echo json_encode(['success' => true]);
        exit;
    } catch (Exception $e) {
        $fallbackHeaders = "From: " . $fromEmail . "\r\n";
        $fallbackHeaders .= "Reply-To: " . $email . "\r\n";
        $fallbackHeaders .= "Content-Type: text/plain; charset=UTF-8\r\n";
        $sent = mail($to, $subject, $body, $fallbackHeaders);
        if ($sent) {
            echo json_encode(['success' => true, 'warning' => 'smtp_failed_fallback_mail_sent']);
        } else {
            echo json_encode(['success' => false, 'error' => 'smtp_failed', 'message' => $e->getMessage()]);
        }
        exit;
    }
} else {
    $headers = "From: " . $fromEmail . "\r\n";
    $headers .= "Reply-To: " . $email . "\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $sent = mail($to, $subject, $body, $headers);
    if ($sent) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => 'mail_failed']);
    }
    exit;
}

?>