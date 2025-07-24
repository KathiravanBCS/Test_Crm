import { Card, Stack, Text, Group, Badge, CopyButton, ActionIcon, Tooltip, SimpleGrid, Divider } from '@mantine/core';
import { IconBuildingBank, IconCopy, IconCheck, IconCurrency } from '@tabler/icons-react';
import type { Partner } from '../types';

interface PartnerBankingCardProps {
  partner: Partner;
}

export function PartnerBankingCard({ partner }: PartnerBankingCardProps) {
  const bankAccounts = partner.bankAccounts || [];
  const hasBankingInfo = bankAccounts.length > 0;

  if (!hasBankingInfo) {
    return (
      <Card withBorder>
        <Stack align="center" py="xl">
          <IconBuildingBank size={48} color="gray" />
          <Text c="dimmed" size="sm">No banking information available</Text>
        </Stack>
      </Card>
    );
  }

  return (
    <Card withBorder>
      <Stack gap="md">
        <Group gap="xs">
          <IconBuildingBank size={20} />
          <Text fw={600}>Banking Information</Text>
        </Group>

        {/* Display new bank accounts structure */}
        {bankAccounts.length > 0 ? (
          <Stack gap="lg">
            {bankAccounts.map((account, index) => (
              <div key={index}>
                {index > 0 && <Divider my="md" />}
                <Stack gap="sm">
                  <Group justify="space-between">
                    <Text fw={500}>{account.accountHolderName}</Text>
                    <Group gap="xs">
                      <Badge variant="light" size="sm" color="blue">
                        {account.accountType || 'Current'}
                      </Badge>
                      {account.currencyCode && (
                        <Badge variant="light" size="sm" color="grape" leftSection={<IconCurrency size={12} />}>
                          {account.currencyCode}
                        </Badge>
                      )}
                    </Group>
                  </Group>

                  <SimpleGrid cols={2} spacing="md">
                    <div>
                      <Text size="sm" c="dimmed" mb={4}>Account Number</Text>
                      <Group gap="xs">
                        <Text ff="monospace" style={{ letterSpacing: '0.5px' }}>
                          {account.accountNumber}
                        </Text>
                        <CopyButton value={account.accountNumber} timeout={2000}>
                          {({ copied, copy }) => (
                            <Tooltip label={copied ? 'Copied' : 'Copy account number'} withArrow position="right">
                              <ActionIcon 
                                color={copied ? 'teal' : 'gray'} 
                                onClick={copy}
                                variant="subtle"
                                size="sm"
                              >
                                {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                              </ActionIcon>
                            </Tooltip>
                          )}
                        </CopyButton>
                      </Group>
                    </div>

                    {account.ifscCode && (
                      <div>
                        <Text size="sm" c="dimmed" mb={4}>IFSC Code</Text>
                        <Group gap="xs">
                          <Text ff="monospace" fw={500} style={{ letterSpacing: '0.5px' }}>
                            {account.ifscCode}
                          </Text>
                          <CopyButton value={account.ifscCode} timeout={2000}>
                            {({ copied, copy }) => (
                              <Tooltip label={copied ? 'Copied' : 'Copy IFSC code'} withArrow position="right">
                                <ActionIcon 
                                  color={copied ? 'teal' : 'gray'} 
                                  onClick={copy}
                                  variant="subtle"
                                  size="sm"
                                >
                                  {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                                </ActionIcon>
                              </Tooltip>
                            )}
                          </CopyButton>
                        </Group>
                      </div>
                    )}

                    {account.swiftCode && (
                      <div>
                        <Text size="sm" c="dimmed" mb={4}>SWIFT Code</Text>
                        <Group gap="xs">
                          <Text ff="monospace" fw={500} style={{ letterSpacing: '0.5px' }}>
                            {account.swiftCode}
                          </Text>
                          <CopyButton value={account.swiftCode} timeout={2000}>
                            {({ copied, copy }) => (
                              <Tooltip label={copied ? 'Copied' : 'Copy SWIFT code'} withArrow position="right">
                                <ActionIcon 
                                  color={copied ? 'teal' : 'gray'} 
                                  onClick={copy}
                                  variant="subtle"
                                  size="sm"
                                >
                                  {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                                </ActionIcon>
                              </Tooltip>
                            )}
                          </CopyButton>
                        </Group>
                      </div>
                    )}

                    {account.bankName && (
                      <div>
                        <Text size="sm" c="dimmed" mb={4}>Bank Name</Text>
                        <Text>{account.bankName}</Text>
                      </div>
                    )}
                  </SimpleGrid>
                </Stack>
              </div>
            ))}

            <Badge variant="light" color="blue" size="sm">
              Commission payments will be made to {bankAccounts.length > 1 ? 'these accounts' : 'this account'}
            </Badge>
          </Stack>
        ) : null}
      </Stack>
    </Card>
  );
}