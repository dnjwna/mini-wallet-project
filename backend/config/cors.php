<?php

return [
    'paths' => ['api/*'],
    'allowed_methods' => ['*'],

    'allowed_origins' => ['https://mini-wallet-project.vercel.app/'],

    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];