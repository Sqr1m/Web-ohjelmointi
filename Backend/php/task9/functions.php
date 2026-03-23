<?php
function e($value): string
{
    return htmlspecialchars((string)$value, ENT_QUOTES, 'UTF-8');
}

function isActive(string $file): string
{
    return basename($_SERVER['PHP_SELF']) === $file ? 'active' : '';
}

function checkedIf($value, $expected): string
{
    return (string)$value === (string)$expected ? 'checked' : '';
}

function selectedIf($value, $expected): string
{
    return (string)$value === (string)$expected ? 'selected' : '';
}

function redirectTo(string $file): void
{
    header("Location: $file");
    exit;
}