/**
 * Microsoft Graph API Query Builder
 * Provides a fluent interface for building OData queries with proper encoding
 * and MS Graph API best practices
 */
export class GraphQueryBuilder {
  private params: Record<string, string> = {};
  private headers: Record<string, string> = {};
  private filters: string[] = [];
  private searchTerms: string[] = [];

  /**
   * Add search query using $search parameter
   * Requires ConsistencyLevel: eventual header
   * Better for text search across multiple fields
   */
  search(query: string | string[]): this {
    const terms = Array.isArray(query) ? query : [query];
    this.searchTerms.push(...terms);
    
    // Set ConsistencyLevel header for $search
    this.headers['ConsistencyLevel'] = 'eventual';
    
    return this;
  }

  /**
   * Add filter condition using $filter parameter
   * Use for exact matches, boolean, date comparisons
   */
  filter(condition: string): this {
    if (condition) {
      this.filters.push(condition);
    }
    return this;
  }

  /**
   * Add multiple filter conditions that will be ANDed together
   */
  filterAnd(...conditions: string[]): this {
    conditions.forEach(condition => {
      if (condition) {
        this.filters.push(condition);
      }
    });
    return this;
  }

  /**
   * Add hasAttachments filter
   */
  hasAttachments(value: boolean): this {
    this.filters.push(`hasAttachments eq ${value}`);
    return this;
  }

  /**
   * Add importance filter
   */
  importance(value: 'low' | 'normal' | 'high'): this {
    this.filters.push(`importance eq '${value}'`);
    return this;
  }

  /**
   * Add isRead filter
   */
  isRead(value: boolean): this {
    this.filters.push(`isRead eq ${value}`);
    return this;
  }

  /**
   * Add date range filter
   * For calendar events, use quotes around dates
   */
  dateRange(field: string, from?: Date, to?: Date): this {
    if (from) {
      // Use quotes for date values in filters
      this.filters.push(`${field} ge '${from.toISOString()}'`);
    }
    if (to) {
      this.filters.push(`${field} le '${to.toISOString()}'`);
    }
    return this;
  }

  /**
   * Add contains filter (for simple text search in specific field)
   */
  contains(field: string, value: string): this {
    const escapedValue = value.replace(/'/g, "''");
    this.filters.push(`contains(${field},'${escapedValue}')`);
    return this;
  }

  /**
   * Add startsWith filter
   */
  startsWith(field: string, value: string): this {
    const escapedValue = value.replace(/'/g, "''");
    this.filters.push(`startswith(${field},'${escapedValue}')`);
    return this;
  }

  /**
   * Select specific fields
   */
  select(fields: string[] | string): this {
    const fieldArray = Array.isArray(fields) ? fields : [fields];
    this.params.$select = fieldArray.join(',');
    return this;
  }

  /**
   * Order by field
   */
  orderBy(field: string, direction: 'asc' | 'desc' = 'desc'): this {
    this.params.$orderby = `${field} ${direction}`;
    return this;
  }

  /**
   * Set pagination
   */
  paginate(skip: number, top: number): this {
    if (skip > 0) {
      this.params.$skip = skip.toString();
    }
    this.params.$top = top.toString();
    return this;
  }

  /**
   * Set top (limit) only
   */
  top(limit: number): this {
    this.params.$top = limit.toString();
    return this;
  }

  /**
   * Expand related entities
   */
  expand(entities: string[] | string): this {
    const entityArray = Array.isArray(entities) ? entities : [entities];
    this.params.$expand = entityArray.join(',');
    return this;
  }

  /**
   * Count total items (adds $count=true)
   */
  count(): this {
    this.params.$count = 'true';
    // Also requires ConsistencyLevel header
    this.headers['ConsistencyLevel'] = 'eventual';
    return this;
  }

  /**
   * Build the final query parameters and headers
   */
  build(): { params: Record<string, string>; headers: Record<string, string> } {
    // Build search query
    if (this.searchTerms.length > 0) {
      // Escape quotes and join terms with OR
      const escapedTerms = this.searchTerms.map(term => `"${term.replace(/"/g, '\\"')}"`);
      this.params.$search = escapedTerms.join(' OR ');
    }

    // Build filter query
    if (this.filters.length > 0) {
      this.params.$filter = this.filters.join(' and ');
    }

    return {
      params: { ...this.params },
      headers: { ...this.headers }
    };
  }

  /**
   * Build query string for URL
   */
  toQueryString(): string {
    const { params } = this.build();
    const queryParts: string[] = [];

    Object.entries(params).forEach(([key, value]) => {
      queryParts.push(`${key}=${encodeURIComponent(value)}`);
    });

    return queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
  }

  /**
   * Apply to a Graph API request
   */
  applyToRequest(request: any): any {
    const { params, headers } = this.build();

    // Apply headers
    Object.entries(headers).forEach(([key, value]) => {
      request = request.header(key, value);
    });

    // Apply query parameters
    if (Object.keys(params).length > 0) {
      request = request.query(params);
    }

    return request;
  }

  /**
   * Create a new instance
   */
  static create(): GraphQueryBuilder {
    return new GraphQueryBuilder();
  }
}

/**
 * Helper functions for common Graph API queries
 */
export const GraphQueries = {
  /**
   * Build email search query
   */
  emailSearch(entityCodes: string[], searchText?: string): GraphQueryBuilder {
    const builder = GraphQueryBuilder.create();

    // Use $search for entity codes and text search
    const searchTerms: string[] = [...entityCodes];
    if (searchText) {
      searchTerms.push(searchText);
    }

    if (searchTerms.length > 0) {
      builder.search(searchTerms);
    }

    return builder;
  },

  /**
   * Build calendar event query
   */
  calendarEvents(from: Date, to: Date, searchText?: string): GraphQueryBuilder {
    const builder = GraphQueryBuilder.create()
      .dateRange('start/dateTime', from, to)
      .orderBy('start/dateTime', 'asc');

    if (searchText) {
      builder.search(searchText);
    }

    return builder;
  },

  /**
   * Build query for emails with attachments
   */
  emailsWithAttachments(): GraphQueryBuilder {
    return GraphQueryBuilder.create()
      .hasAttachments(true)
      .orderBy('receivedDateTime', 'desc');
  },

  /**
   * Build query for unread emails
   */
  unreadEmails(): GraphQueryBuilder {
    return GraphQueryBuilder.create()
      .isRead(false)
      .orderBy('receivedDateTime', 'desc');
  },

  /**
   * Build query for high importance emails
   */
  highImportanceEmails(): GraphQueryBuilder {
    return GraphQueryBuilder.create()
      .importance('high')
      .orderBy('receivedDateTime', 'desc');
  }
};