package com.meow.app;

import android.app.Activity;
import android.os.CancellationSignal;
import androidx.annotation.NonNull;
import androidx.credentials.Credential;
import androidx.credentials.CredentialManager;
import androidx.credentials.CredentialManagerCallback;
import androidx.credentials.CustomCredential;
import androidx.credentials.GetCredentialRequest;
import androidx.credentials.GetCredentialResponse;
import androidx.credentials.exceptions.GetCredentialCancellationException;
import androidx.credentials.exceptions.GetCredentialException;
import androidx.credentials.exceptions.GetCredentialUnsupportedException;
import androidx.credentials.exceptions.NoCredentialException;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.android.libraries.identity.googleid.GetSignInWithGoogleOption;
import com.google.android.libraries.identity.googleid.GoogleIdTokenCredential;
import com.google.android.libraries.identity.googleid.GoogleIdTokenParsingException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@CapacitorPlugin(name = "MeowGoogleAuth")
public class GoogleAuthPlugin extends Plugin {

    private final ExecutorService executor = Executors.newSingleThreadExecutor();

    @PluginMethod
    public void signIn(PluginCall call) {
        final String serverClientId = call.getString("serverClientId");
        final String nonce = call.getString("nonce");

        if (serverClientId == null || serverClientId.trim().isEmpty()) {
            call.reject("Missing Google Web Client ID.", "missing_web_client_id");
            return;
        }

        final Activity activity = getActivity();
        if (activity == null) {
            call.reject("Android Activity is unavailable.", "activity_unavailable");
            return;
        }

        try {
            GetSignInWithGoogleOption.Builder optionBuilder =
                new GetSignInWithGoogleOption.Builder(serverClientId.trim());
            if (nonce != null && !nonce.trim().isEmpty()) {
                optionBuilder.setNonce(nonce.trim());
            }

            GetSignInWithGoogleOption signInWithGoogleOption = optionBuilder.build();
            GetCredentialRequest request = new GetCredentialRequest.Builder()
                .addCredentialOption(signInWithGoogleOption)
                .build();

            CredentialManager credentialManager = CredentialManager.create(activity);
            CancellationSignal cancellationSignal = new CancellationSignal();

            credentialManager.getCredentialAsync(
                activity,
                request,
                cancellationSignal,
                executor,
                new CredentialManagerCallback<GetCredentialResponse, GetCredentialException>() {
                    @Override
                    public void onResult(@NonNull GetCredentialResponse result) {
                        Credential credential = result.getCredential();
                        if (
                            credential instanceof CustomCredential &&
                            GoogleIdTokenCredential.TYPE_GOOGLE_ID_TOKEN_CREDENTIAL.equals(credential.getType())
                        ) {
                            try {
                                GoogleIdTokenCredential googleCred =
                                    GoogleIdTokenCredential.createFrom(credential.getData());
                                JSObject ret = new JSObject();
                                ret.put("idToken", googleCred.getIdToken());
                                ret.put("id", googleCred.getId());
                                ret.put("displayName", googleCred.getDisplayName());
                                ret.put("givenName", googleCred.getGivenName());
                                ret.put("familyName", googleCred.getFamilyName());
                                if (googleCred.getProfilePictureUri() != null) {
                                    ret.put("profilePictureUri", googleCred.getProfilePictureUri().toString());
                                }
                                call.resolve(ret);
                            } catch (Exception parseError) {
                                String errorCode = (parseError instanceof GoogleIdTokenParsingException)
                                    ? "invalid_google_credential"
                                    : "google_auth_failed";
                                call.reject(
                                    "Failed to parse Google ID token credential.",
                                    errorCode,
                                    parseError
                                );
                            }
                        } else {
                            call.reject(
                                "Unexpected credential type returned by Android Credential Manager.",
                                "unexpected_credential_type"
                            );
                        }
                    }

                    @Override
                    public void onError(@NonNull GetCredentialException error) {
                        String rawMessage = error.getMessage() != null ? error.getMessage() : "Google sign-in failed.";
                        if (error instanceof GetCredentialCancellationException) {
                            call.reject(rawMessage, "user_cancelled", error);
                        } else if (error instanceof GetCredentialUnsupportedException) {
                            call.reject(rawMessage, "credential_manager_unsupported", error);
                        } else if (error instanceof NoCredentialException) {
                            call.reject(rawMessage, "no_credentials", error);
                        } else {
                            call.reject(rawMessage, "google_auth_failed", error);
                        }
                    }
                }
            );
        } catch (Exception ex) {
            call.reject(
                ex.getMessage() != null ? ex.getMessage() : "Failed to initialize Google Credential Manager.",
                "google_auth_init_failed",
                ex
            );
        }
    }

    @Override
    protected void handleOnDestroy() {
        executor.shutdownNow();
        super.handleOnDestroy();
    }
}
