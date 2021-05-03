import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

export function formatDate(date: string, formating?: string): string {
  return format(new Date(date), formating ?? 'dd LLL yyyy', {
    locale: ptBR,
  });
}
