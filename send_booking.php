<?php
header('Content-Type: application/json; charset=utf-8');

$to = 'mbhelelindo23@gmail.com';

// Helper to fetch POST values safely
function val($k) {
    return isset($_POST[$k]) ? trim($_POST[$k]) : '';
}

$requestType = val('requestType');
$fullName    = val('fullName');
$bookEmail   = val('bookEmail');
$phone       = val('phone');
$service     = val('serviceRequired');
$medicalAid  = val('medicalAid');
$bookDate    = val('bookDate');
$branch      = val('branch');
$description = val('description');
$consent     = val('consent');

$remoteIp = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$consentTime = date('c');

if (!$fullName || !$bookEmail) {
    echo json_encode(['success' => false, 'error' => 'missing_fields']);
    exit;
}
if (strtolower($consent) !== 'yes') {
    echo json_encode(['success' => false, 'error' => 'consent_required']);
    exit;
}

$subject = "Website Booking/Enquiry: " . ($requestType ?: 'Enquiry') . " — " . $fullName;

$body = "New booking/enquiry from website:\n\n";
$body .= "Name: " . $fullName . "\n";
$body .= "Email: " . $bookEmail . "\n";
$body .= "Phone: " . $phone . "\n";
$body .= "Request Type: " . $requestType . "\n";
$body .= "Service: " . $service . "\n";
$body .= "Medical Aid: " . $medicalAid . "\n";
$body .= "Preferred Date: " . $bookDate . "\n";
$body .= "Preferred Branch: " . $branch . "\n\n";
$body .= "Description:\n" . $description . "\n\n";
$body .= "Sent from: " . ($_SERVER['HTTP_HOST'] ?? 'website') . "\n";

$body .= "Consent: " . ($consent ? $consent : 'no') . "\n";
$body .= "Consent Timestamp: " . $consentTime . "\n";
$body .= "Sender IP: " . $remoteIp . "\n";

// SMTP / PHPMailer configuration
// Set the following environment variables in your Laragon or server environment
// SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_PORT, SMTP_SECURE
$use_smtp = true; // set to false to force mail() fallback
$smtpHost = getenv('SMTP_HOST') ?: 'smtp.example.com';
$smtpUser = getenv('SMTP_USER') ?: 'user@example.com';
$smtpPass = getenv('SMTP_PASS') ?: 'password';
$smtpPort = getenv('SMTP_PORT') ?: 587;
$smtpSecure = getenv('SMTP_SECURE') ?: 'tls'; // 'tls' or 'ssl' or ''

$fromEmail = filter_var($bookEmail, FILTER_VALIDATE_EMAIL) ? $bookEmail : ($smtpUser ?: 'no-reply@' . ($_SERVER['SERVER_NAME'] ?? 'localhost'));

// Try PHPMailer via Composer autoload if available and SMTP is enabled
if ($use_smtp && file_exists(__DIR__ . '/vendor/autoload.php')) {
    require __DIR__ . '/vendor/autoload.php';
    $mail = new PHPMailer\PHPMailer\PHPMailer(true);
    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host       = $smtpHost;
        $mail->SMTPAuth   = true;
        $mail->Username   = $smtpUser;
        $mail->Password   = $smtpPass;
        if (!empty($smtpSecure)) $mail->SMTPSecure = $smtpSecure;
        $mail->Port       = (int)$smtpPort;
        $mail->CharSet    = 'UTF-8';

        // Recipients
        $mail->setFrom($smtpUser, 'ND-Physio Website');
        $mail->addAddress($to);
        if (filter_var($bookEmail, FILTER_VALIDATE_EMAIL)) {
            $mail->addReplyTo($bookEmail, $fullName ?: 'Website User');
        }

        // Content
        $mail->Subject = $subject;
        $mail->Body    = $body;

        $mail->send();
        echo json_encode(['success' => true]);
        exit;
    } catch (Exception $e) {
        // PHPMailer failed — attempt mail() fallback
        $fallbackHeaders = "From: " . $fromEmail . "\r\n";
        $fallbackHeaders .= "Reply-To: " . $bookEmail . "\r\n";
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
    // No PHPMailer/autoload — use PHP mail() as a fallback
    $headers = "From: " . $fromEmail . "\r\n";
    $headers .= "Reply-To: " . $bookEmail . "\r\n";
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