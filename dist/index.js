The code you provided is written in JavaScript and utilizes AWS SDK and GitHub Actions core library. The conversion to PHP is not straightforward because there are no direct equivalents for these libraries in PHP. However, the following code is an attempt to create a similar functionality using PHP and AWS PHP SDK.

```php
<?php

require 'vendor/autoload.php';
use Aws\Ssm\SsmClient;

function runCommand() {
    $inputs = sanitizeInputs();
    
    $ssmClient = new SsmClient([
        'version'     => 'latest',
        'region'      => $inputs['region'],
        'credentials' => [
            'key'    => $inputs['accessKeyId'],
            'secret' => $inputs['secretAccessKey'],
        ],
    ]);

    $params = [
        'InstanceIds' => [$inputs['instanceIds']],
        'DocumentName' => $inputs['documentName'],
        'Comment' => $inputs['comment'],
        'Parameters' => [
            'workingDirectory' => [$inputs['workingDirectory']],
            'commands' => [$inputs['command']],
        ],
    ];
    
    try {
        $result = $ssmClient->sendCommand($params);
        var_dump($result);
    } catch (AwsException $e) {
        echo $e->getMessage() . "\n";
    }
}

function sanitizeInputs() {
    $inputs = [
        'accessKeyId' => getenv('AWS_ACCESS_KEY_ID'),
        'secretAccessKey' => getenv('AWS_SECRET_ACCESS_KEY'),
        'region' => getenv('AWS_REGION'),
        'instanceIds' => getenv('INSTANCE_IDS'),
        'command' => getenv('COMMAND'),
        'documentName' => 'AWS-RunShellScript',
        'workingDirectory' => getenv('WORKING_DIRECTORY'),
        'comment' => getenv('COMMENT'),
    ];
    
    return $inputs;
}

runCommand();

?>
```

Please note that this code requires the AWS PHP SDK, which can be installed via composer with `composer require aws/aws-sdk-php`. Also, the environment variables should be set before running the script. This PHP script attempts to send a command to an AWS SSM managed instance. Please ensure you have the correct permissions and instance is properly configured. Error handling and response handling is simplified in this example.