// Input validation helpers

const validateEmail = (email) => {
  // Safer email regex to prevent ReDoS attacks
  // Allows basic email format: localpart@domain.tld
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
};

const validateUserRole = (role) => {
  if (!role) return true; // Allow empty/undefined (will use default)
  const validRoles = ['admin', 'manager', 'lead', 'developer'];
  return validRoles.includes(role);
};

const validateProjectStatus = (status) => {
  if (!status) return true; // Allow empty/undefined (will use default)
  const validStatuses = ['planning', 'in-progress', 'on-hold', 'completed'];
  return validStatuses.includes(status);
};

const validateProjectPriority = (priority) => {
  if (!priority) return true; // Allow empty/undefined (will use default)
  const validPriorities = ['low', 'medium', 'high', 'critical'];
  return validPriorities.includes(priority);
};

const validateOperationType = (type) => {
  if (!type) return true; // Allow empty/undefined (will use default)
  const validTypes = ['maintenance', 'security', 'deployment', 'monitoring', 'support'];
  return validTypes.includes(type);
};

const validateOperationStatus = (status) => {
  if (!status) return true; // Allow empty/undefined (will use default)
  const validStatuses = ['pending', 'in-progress', 'completed', 'failed'];
  return validStatuses.includes(status);
};

const validateDate = (dateString) => {
  if (!dateString) return true;
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

const validateDateOrder = (startDate, endDate) => {
  if (!startDate || !endDate) return true;
  return new Date(startDate) <= new Date(endDate);
};

const validateProgress = (progress) => {
  if (progress === undefined || progress === null) return true;
  const num = Number(progress);
  return !isNaN(num) && num >= 0 && num <= 100;
};

module.exports = {
  validateEmail,
  validateUserRole,
  validateProjectStatus,
  validateProjectPriority,
  validateOperationType,
  validateOperationStatus,
  validateDate,
  validateDateOrder,
  validateProgress
};
