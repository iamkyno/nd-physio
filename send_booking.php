<?php
header('Content-Type: application/json; charset=utf-8');

$to = 'bookings@noxolodumaphysio.co';
$fromAddress = 'noreply@noxolodumaphysio.co.za';
$fromName = 'Noxolo Duma Physiotherapy';

function val($k) {
    return isset($_POST[$k]) ? trim($_POST[$k]) : '';
}

$requestType = val('requestType');
$fullName = val('fullName');
$bookEmail = val('bookEmail');
$phone = val('phone');
$service = val('serviceRequired');
$medicalAid = val('medicalAid');
$bookDate = val('bookDate');
$branch = val('branch');
$description = val('description');
$consent = val('consent');

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

$subject = 'Website Booking/Enquiry: ' . ($requestType ?: 'Enquiry') . ' - ' . $fullName;

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
    $mail->addAddress($to);
    if (filter_var($bookEmail, FILTER_VALIDATE_EMAIL)) {
        $mail->addReplyTo($bookEmail, $fullName ?: 'Website User');
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
