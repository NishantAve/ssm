import AWS from 'aws-sdk';
import * as core from '@actions/core';
// Improved function with async/await
async function runCommand() {
    var _a;
    try {
        const inputs = sanitizeInputs();
        // AWS Configure
        AWS.config.update({
            accessKeyId: inputs.accessKeyId,
            secretAccessKey: inputs.secretAccessKey,
            region: inputs.region,
        });
        // Run Send Command
        const ssm = new AWS.SSM();
        const params = {
            InstanceIds: inputs.instanceIds,
            DocumentName: inputs.documentName,
            Comment: inputs.comment,
            Parameters: {
                workingDirectory: [inputs.workingDirectory],
                commands: [inputs.command],
            },
        };
        const data = await ssm.sendCommand(params).promise();
        console.log(data);
        core.setOutput("command-id", (_a = data.Command) === null || _a === void 0 ? void 0 : _a.CommandId);
    }
    catch (err) {
        // Assume err is of type AWSError for AWS SDK errors, but handle other error types gracefully
        if (err instanceof Error) { // This checks if it's an Error object, which includes AWSError
            console.error(err.message); // Log the error message
            // If you're sure it's an AWSError, you can assert the type to access AWS-specific properties
            if ("code" in err) {
                console.error(`AWS Error Code: ${err["code"]}`);
            }
            // Use the error message for setting the failure in GitHub Actions
            core.setFailed(err.message);
        }
        else {
            // Handle non-Error objects, which shouldn't typically occur in this context
            console.error("An unexpected error occurred", err);
            core.setFailed("An unexpected error occurred");
        }
    }
}
function sanitizeInputs() {
    // Inputs are sanitized and fetched here
    const inputs = {
        accessKeyId: core.getInput("aws-access-key-id", { required: true }),
        secretAccessKey: core.getInput("aws-secret-access-key", { required: true }),
        region: core.getInput("aws-region", { required: true }),
        instanceIds: core.getInput("instance-ids", { required: true }).split(/\s+/), // Split on any whitespace
        command: core.getInput("command"),
        documentName: "AWS-RunShellScript", // As before, assuming constant
        workingDirectory: core.getInput("working-directory"),
        comment: core.getInput("comment"),
    };
    return inputs;
}
// Execute the function
runCommand();
